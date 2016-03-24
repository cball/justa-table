import Ember from 'ember';
import layout from '../templates/components/table-vertical-item';
import VerticalItem from 'smoke-and-mirrors/components/vertical-item';

const {
  get,
  computed,
  computed: { readOnly }
} = Ember;

export default VerticalItem.extend({
  layout,
  classNameBindings: ['isLoading', 'collapsable', 'isCollapsed:is-collapsed:is-expanded'],

  isLoading: readOnly('content.loading'),
  collapsable: computed('content.isParent', function() {
    let isParent = get(this, 'content.isParent');
    return isParent === true;
  }),

  isCollapsed: computed('content.isCollapsed', function() {
    let isCollapsed = get(this, 'content.isCollapsed');
    return isCollapsed === true;
  })
});
