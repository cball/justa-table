import Ember from 'ember';
import ChildComponentSupport from 'ember-composability/mixins/child-component-support';
import TableColumns from './table-columns';
import layout from '../templates/components/table-column';

export default Ember.Component.extend(ChildComponentSupport, {
  layout: layout,
  tagName: 'td',
  headerComponent: 'basic-header',
  _parentComponentTypes: [TableColumns],

  init() {
    this._super(...arguments);
    console.log('what the')
  }
});
