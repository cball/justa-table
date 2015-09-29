import Ember from 'ember';
import ParentComponentSupport from 'ember-composability/mixins/parent-component-support';
import ChildComponentSupport from 'ember-composability/mixins/child-component-support';
import Table from './justa-table';
import layout from '../templates/components/table-columns';

const { readOnly } = Ember.computed;
const { A, computed } = Ember;

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
  }).readOnly()
});
