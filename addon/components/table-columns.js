import Ember from 'ember';
import layout from '../templates/components/table-columns';

const {
  A,
  get,
  set,
  isEmpty,
  isNone,
  computed,
  computed: { readOnly }
} = Ember;

export default Ember.Component.extend({
  layout,
  classNames: ['table-columns'],
  headerClassNames: [],

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
    Merged css classes to apply to table rows. Merges table.rowClasses and rowClasses.
    @public
  */
  mergedRowClasses: computed('table.rowClasses', 'rowClasses', function() {
    let tableClasses = this.get('table.rowClasses');
    let rowClasses = this.get('rowClasses');
    return new A([tableClasses, rowClasses]).compact().join(' ');
  }),

  /**
    Sets an inline style for height on all table rows from table.rowHeight.
    @public
  */
  rowHeight: computed('table.rowHeight', function() {
    let rowHeight = this.get('table.rowHeight');

    if (rowHeight) {
      return new Ember.Handlebars.SafeString(`height: ${rowHeight}`);
    }

    return new Ember.Handlebars.SafeString('');
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
  },

  didInsertElement() {
    this.$().on('mouseenter', 'tr', this._onRowEnter.bind(this));
    this.$().on('mouseleave', 'tr', this._onRowLeave.bind(this));
  },

  willDestroyElement() {
    this.$().off('mouseenter', 'tr', this._onRowEnter.bind(this));
    this.$().off('mouseleave', 'tr', this._onRowLeave.bind(this));
  },

  _onRowEnter() {
    let rowIndex = this.$('tr').index(this.$('tr:hover'));
    this.getAttr('table').$(`tr.table-row:nth-child(${rowIndex})`).addClass('hover');
  },

  _onRowLeave() {
    this.getAttr('table').$('tr').removeClass('hover');
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
      // no-op
    }
  }
});
