import Ember from 'ember';
import layout from '../templates/components/table-columns';

const {
  A,
  getWithDefault,
  computed,
  computed: { readOnly },
  run
} = Ember;

const DEFAULT_ROW_HEIGHT = 37;

export default Ember.Component.extend({
  layout,
  classNames: ['table-columns-wrapper'],
  columnType: 'standard',

  /**
    The parent table component, it is expected to be passed in.
    @public
  */
  table: null,

  /**
    All columns currently registered with this wrapper.
    @private
  */
  _allColumns: null,

  /**
    Css classes to apply to table rows.
    @public
  */
  rowClasses: null,

  /**
    Name of data property for row groups
    @public
  */
  rowGroupDataName: readOnly('table.rowGroupDataName'),

  topRowIndex: readOnly('table.topRowIndex'),
  bottomRowIndex: readOnly('table.bottomRowIndex'),

  init() {
    this._super(...arguments);
    this.classNames.pushObject(`${this.columnType}-table-columns-wrapper`);
    this._allColumns = new A();
  },

  /**
    If the intiial width/position has been set after rendering.
    @public
  */
  widthAndPositionSet: false,

  /**
    Returns the widths of columns in this set of table columns.
    @public
  */
  columnWidths: computed.mapBy('columns', 'width'),

  /**
    Returns the widths of the column borders
    @public
  */
  columnBorderWidths: computed('columns.[]', function columnBorderWidths() {
    return this.get('columns').map((column) => {
      let style = getComputedStyle(column.element);
      return parseInt(style.borderRightWidth, 10) + parseInt(style.borderLeftWidth, 10);
    });
  }),

  /**
    Returns the width of the total width of this set of table columns,
    including borders.
    @public
  */
  tableWidth: computed('columnWidths.[]', 'columnBorderWidths.[]', function tableWidth() {
    let array = this.get('columnWidths').concat(this.get('columnBorderWidths'));
    return array.reduce((sum, item) => sum + item, 0);
  }),

  /**
    Merged css classes to apply to table rows. Merges table.rowClasses and rowClasses.
    @public
  */
  mergedRowClasses: computed('table.rowClasses', 'rowClasses', function() {
    let tableClasses = this.get('table.rowClasses');
    let rowClasses = this.get('rowClasses');

    return new A([tableClasses, rowClasses]).compact().join(' ');
  }),

  /**
    Gets table's rowHeight.
    @public
    @default DEFAULT_ROW_HEIGHT
  */
  rowHeight: computed('table.rowHeight', function() {
    let height = getWithDefault(this, 'table.rowHeight', DEFAULT_ROW_HEIGHT);
    height = height.toString().replace(/px/, '');
    return new Ember.Handlebars.SafeString(`height: ${height}px`);
  }),

  /**
    Keeps track of all unique columns. Used to render the th's of the table.
    Uniques on header name.
    @returns { Array } Array of unique columns
    @public
  */
  columns: computed('_allColumns.[]', function columns() {
    let uniqueColumns = new A();
    this.get('_allColumns').forEach((column) => {
      let headerName = column.get('headerName');
      let existingHeaderNames = new A(uniqueColumns.mapBy('headerName'));
      if (!existingHeaderNames.contains(headerName)) {
        uniqueColumns.push(column);
      }
    });

    let columnLength = this.get('_columnLength');
    if (columnLength !== uniqueColumns.length) {
      this.set('_columnLength', uniqueColumns.length);
      this.set('widthAndPositionSet', false);
      run.scheduleOnce('afterRender', this, this.reflowStickyHeaders);

      // jscs:disable requireCommentsToIncludeAccess
      /**
        TODO: replace floatThead with custom solution.
        floatThead gets its positioning out of wack on adding columns. This
        resets the standard column scroll position on column change, which
        makes things line up properly.

      */
      run.scheduleOnce('afterRender', this, () => {
        this.$('.table-columns').scrollLeft(0);
      });
    }

    return uniqueColumns.sortBy('index');
  }),

  _columnLength: 0,

  /**
    Register a child column with this table columns wrapper.
    @param { Object } The column to register
    @public
  */
  registerColumn(column) {
    let columns = this.get('_allColumns');
    column.index = column.index || -1;
    columns.addObject(column);
  },

  /**
    Unregister a previously registered child column with this table columns
    wrapper.
    @param { Object } The column to register
    @public
  */
  unregisterColumn(column) {
    let allColumns = this.get('_allColumns');
    if (allColumns) {
      allColumns.removeObject(column);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this.$().on('mouseenter', 'tr', this._onRowEnter.bind(this));
    this.$().on('mouseleave', 'tr', this._onRowLeave.bind(this));
  },

  willDestroyElement() {
    this._super(...arguments);
    this._uninstallStickyHeaders();
    this.set('_allColumns', null);

    this.$().off('mouseenter', 'tr', this._onRowEnter.bind(this));
    this.$().off('mouseleave', 'tr', this._onRowLeave.bind(this));
  },

  /**
    Removes the sticky headers plugin if this table uses it.
    @private
  */
  _uninstallStickyHeaders() {
    let usingStickyHeaders = this.get('table.stickyHeaders');
    let $table = this.$('table');

    if (usingStickyHeaders && $table) {
      $table.floatThead('destroy');
    }
  },

  didRender() {
    this._super(...arguments);
    run.next(() => {
      this._setTableWidthAndPosition();
      this.get('table').didRenderCollection();
    });
  },

  didReceiveAttrs() {
    this._super(...arguments);
    // make sure we run width and position calculations again
    this.set('widthAndPositionSet', false);
  },

  /**
    If using sticky headers, call reflow on them.
    @private
  */
  reflowStickyHeaders() {
    let usingStickyHeaders = this.get('table.stickyHeaders');
    let $table = this.$('table');

    if (usingStickyHeaders && $table) {
      this.$('table').floatThead('reflow');
    }
  },

  /**
    Table columns set their width to the table width - fixed column
    width.
    @private
  */
  _setTableWidthAndPosition() {
    let table = this.get('table');
    let tableWidth = this.get('tableWidth');
    let hasBeenSet = this.get('widthAndPositionSet');
    if (tableWidth === 0 || hasBeenSet) {
      return;
    }

    let fixedColumnWidth = table.fixedColumnWidth();
    let width = table.$().width() - fixedColumnWidth;
    let paddingLeft = fixedColumnWidth;

    this.$().css({
      paddingLeft
    });

    this.$('.table-columns').css({
      width
    });

    this.set('widthAndPositionSet', true);
  },

  /**
    Adds a hover class to rows when hovered to keep fixed columns
    and standard columns hover states in sync.
    @private
  */
  _onRowEnter() {
    if (this.get('isDestroying') || this.get('isDestroyed')) {
      return;
    }
    let rowIndex = this.$('tr.table-row').index(this.$('tr:hover'));

    this._onRowLeave();
    this.get('table').$(`tr.table-row:nth-of-type(${rowIndex + 1})`).addClass('hover');
  },

  _onRowLeave() {
    if (this.get('isDestroying') || this.get('isDestroyed')) {
      return;
    }

    this.get('table').$('tr').removeClass('hover');
  },

  actions: {
    columnWidthChanged(/* column, newWidth */) {
      this.reflowStickyHeaders();
    }
  }
});
