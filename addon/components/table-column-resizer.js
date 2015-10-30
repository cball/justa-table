import Ember from 'ember';
import layout from '../templates/components/table-column-resizer';

const { A, computed } = Ember;

export default Ember.Component.extend({
  layout,
  classNames: ['resize-handle-container'],

  columns: null,

  init() {
    this.columns = new A();
    this._super(...arguments);
  },

  resizableColumns: computed.filterBy('columns', 'resizable', true)
});
