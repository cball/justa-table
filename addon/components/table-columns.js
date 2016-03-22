import Ember from 'ember';
import layout from '../templates/components/table-columns';

const {
  A,
  get,
  getWithDefault,
  set,
  isEmpty,
  isNone,
  computed,
  computed: { readOnly },
  run: { scheduleOnce }
} = Ember;

const DEFAULT_ROW_HEIGHT = 37;

export default Ember.Component.extend({
  layout,
  classNames: ['table-columns-wrapper'],
  values: {},

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

  init() {
    this._super(...arguments);
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
    return getWithDefault(this, 'table.rowHeight', DEFAULT_ROW_HEIGHT);
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

    return uniqueColumns.sortBy('index');
  }),

  /**
    Register a child column with this table columns wrapper.
    @param { Object } The column to register
    @public
  */
  registerColumn(column) {
    let columns = this.get('_allColumns');
    column.index = column.index || -1;
    columns.addObject(column);
    scheduleOnce('afterRender', this, this._reflowStickyHeaders);
  },

  /**
    Unregister a previously registered child column with this table columns
    wrapper.
    @param { Object } The column to register
    @public
  */
  unregisterColumn(column) {
    let allColumns = this.get('_allColumns');
    allColumns.removeObject(column);
    scheduleOnce('afterRender', this, this._reflowStickyHeaders);
  },

  didInsertElement() {
    this._setupStickyHeaders();

    this.$().on('mouseenter', 'tr', this._onRowEnter.bind(this));
    this.$().on('mouseleave', 'tr', this._onRowLeave.bind(this));
  },

  /**
    Installs the sticky headers plugin if the table should use it.
    @private
  */
  _setupStickyHeaders() {
    let usingStickyHeaders = this.get('table.stickyHeaders');

    if (usingStickyHeaders) {
      this.$('table').floatThead({
        position: 'absolute',
        scrollContainer($table) {
          return $table.closest('.table-columns');
        }
      });
    }
  },

  willDestroyElement() {
    this._uninstallStickyHeaders();

    this.$().off('mouseenter', 'tr', this._onRowEnter.bind(this));
    this.$().off('mouseleave', 'tr', this._onRowLeave.bind(this));
  },

  /**
    Removes the sticky headers plugin if this table uses it.
    @private
  */
  _uninstallStickyHeaders() {
    let usingStickyHeaders = this.get('table.stickyHeaders');

    if (usingStickyHeaders) {
      this.$('table').floatThead('destroy');
    }
  },

  didRender() {
    this._super(...arguments);
    this.get('table').didRenderCollection();

    if (!this.get('widthAndPositionSet')) {
      this._reflowStickyHeaders();
    }

    this._setTableWidthAndPosition();
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
  _reflowStickyHeaders() {
    let usingStickyHeaders = this.get('table.stickyHeaders');

    if (usingStickyHeaders) {
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
    let left = fixedColumnWidth;

    this.$().css({
      left
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
    let rowIndex = this.$('tr').index(this.$('tr:hover'));
    let hasStickyHeaders = this.get('table.stickyHeaders');

    // sticky headers creates a shell table, don't count that row
    if (hasStickyHeaders) {
      rowIndex = Math.max(0, rowIndex - 1);
    }

    this._onRowLeave();
    this.get('table').$(`tr.table-row:nth-of-type(${rowIndex})`).addClass('hover');
  },

  _onRowLeave() {
    this.get('table').$('tr').removeClass('hover');
  },

  actions: {
    // TODO: move to collapse table
    toggleRowCollapse(rowGroup) {
      let collapsed = get(rowGroup, 'isCollapsed');

      if (isNone(collapsed)) {
        set(rowGroup, 'isCollapsed', false);
      } else {
        set(rowGroup, 'isCollapsed', !rowGroup.isCollapsed);
      }
      // TODO make this smarter by taking option if we should do this
      let rowData = get(rowGroup, this.get('rowGroupDataName'));
      let shouldFetch = isEmpty(rowData) && !rowGroup.isCollapsed;

      if (shouldFetch) {
        set(rowGroup, 'loading', true);
        this.attrs.onRowExpand(rowGroup).then((data) => {
          set(rowGroup, this.get('rowGroupDataName'), rowData.concat(data));
        }).finally(() => {
          set(rowGroup, 'loading', false);
        });
      }
    },

    columnWidthChanged(/* column, newWidth */) {
      this._reflowStickyHeaders();
    }
  }
});
