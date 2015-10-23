import Ember from 'ember';
import ParentComponentSupport from 'ember-composability/mixins/parent-component-support';
import ChildComponentSupport from 'ember-composability/mixins/child-component-support';
import Table from './justa-table';
import layout from '../templates/components/table-columns';

const { readOnly } = Ember.computed;
const {
  A,
  computed,
  set,
  isEmpty
} = Ember;

export default Ember.Component.extend(ParentComponentSupport, ChildComponentSupport, {
  layout: layout,
  _parentComponentTypes: [Table],
  table: readOnly('composableParent'),

  init() {
    this._super(...arguments);
    this.classNames = ['table-columns'];
  },

  columns: computed('composableChildren', function() {
    return new A(this.get('composableChildren'));
  }).readOnly(),

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
