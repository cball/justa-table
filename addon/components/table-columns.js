import Ember from 'ember';
import layout from '../templates/components/table-columns';

const {
  A,
  set,
  isEmpty
} = Ember;

export default Ember.Component.extend({
  layout: layout,

  init() {
    this._super(...arguments);
    this.classNames = ['table-columns'];
    this.columns = new A();
  },

  registerColumn(column) {
    let columns = this.get('columns');

    // TODO: better via id?
    if (!columns.findBy('headerName', column.get('headerName'))) {
      columns.addObject(column);
    }
  },

  unregisterColumn(column) {
    let columns = this.get('columns');
    columns.removeObject(column);
  },

  actions: {
    toggleRowCollapse(rowGroup) {
      set(rowGroup, 'isCollapsed', !rowGroup.isCollapsed);

      // TODO make this smarter by taking option if we should do this
      let shouldFetch = isEmpty(rowGroup.data) && !rowGroup.isCollapsed;

      if (shouldFetch) {
        set(rowGroup, 'loading', true);
        this.attrs.onRowExpand(rowGroup).then(data => {
          rowGroup.data = rowGroup.data.concat(data);
        }).finally(() => {
          set(rowGroup, 'loading', false);
        });
      }
    }
  }
});
