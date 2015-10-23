import Ember from 'ember';
import ChildComponentSupport from 'ember-composability/mixins/child-component-support';
import TableColumns from './table-columns';
import FixedColumns from './fixed-table-columns';
import layout from '../templates/components/table-column';

const { computed, get, isEmpty } = Ember;

export default Ember.Component.extend(ChildComponentSupport, {
  layout: layout,
  tagName: 'td',
  _parentComponentTypes: [TableColumns, FixedColumns],

  init() {
    this._super(...arguments);
    this.headerComponent = 'basic-header';
    this.useFakeRowspan = this.useFakeRowspan || false;
    this.resizable = this.resizable || false;
  },

  _value: computed('valueBindingPath', 'row', function() {
    const path = this.get('valueBindingPath');
    const row = this.get('row');
    const hasBlockParams = this.get('hasBlockParams');

    if (hasBlockParams || isEmpty(path) || isEmpty(row)) {
      return null;
    }

    return get(row, path);
  }),

  shouldRegisterToParent(parentComponent) {
    const childComponents = parentComponent.getComposableChildren();
    if (Ember.isEmpty(childComponents)) {
      return true;
    } else {
      const child = childComponents.findBy('headerName', this.get('headerName'));
      return Ember.isNone(child);
    }
  }
});
