import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  dynamicColumns: null,

  init() {
    this._super(...arguments);
    this.dynamicColumns = [
      {
        label: 'Dynamic 1',
        value: 'one',
        width: 250
      },
      {
        label: 'Dynamic 2',
        value: 'two',
        width: 100
      }
    ];
  },

  actions: {
    removeAColumn() {
      let removed = this.get('dynamicColumns').slice(0, 1);
      this.set('dynamicColumns', removed);
    },

    removeSomeRows() {
      this.sendAction('removeSomeRows');
    }
  }
});
