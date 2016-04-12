import layout from '../templates/components/collapsable-table-row';
import TableRow from './table-row';
import Ember from 'ember';

const {
  computed
} = Ember;

export default TableRow.extend({
  layout,
  classNameBindings: ['isParent:collapsable', 'isCollapsed:is-collapsed:is-expanded', 'isLoading'],

  isParent: computed.equal('content.isParent', true),
  isCollapsed: computed.equal('content.isCollapsed', true),
  isLoading: computed.readOnly('content.loading')
});
