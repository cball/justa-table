import Ember from 'ember';
import layout from '../templates/components/table-columns';

const {
  A,
  set,
  isEmpty,
  computed
} = Ember;

export default Ember.Component.extend({
  layout,
  classNames: ['table-columns'],

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

  init() {
    this._super(...arguments);
    this._allColumns = new A();
  },

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
    // let existingColumn = columns.findBy('headerName', column.get('headerName'));
    // let oldIndex = columns.indexOf(existingColumn);
    // let newIndex = column.getWithDefault('index', -1);

    // if (existingColumn && newIndex > -1 && oldIndex !== newIndex) {
    //   columns.splice(oldIndex, 1);
    //   columns.splice(newIndex, 0, column);
    // } else {
    columns.addObject(column);
    // }
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

  actions: {
    // TODO: move to collapse table
    toggleRowCollapse(rowGroup) {
      set(rowGroup, 'isCollapsed', !rowGroup.isCollapsed);

      // TODO make this smarter by taking option if we should do this
      let shouldFetch = isEmpty(rowGroup.data) && !rowGroup.isCollapsed;

      if (shouldFetch) {
        set(rowGroup, 'loading', true);
        this.attrs.onRowExpand(rowGroup).then((data) => {
          rowGroup.data = rowGroup.data.concat(data);
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
