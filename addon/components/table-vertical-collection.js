import Ember from 'ember';
import layout from '../templates/components/table-vertical-collection';
import VerticalCollection from 'smoke-and-mirrors/components/vertical-collection';

export default VerticalCollection.extend({
  layout,
  'on-row-click': Ember.K
});
