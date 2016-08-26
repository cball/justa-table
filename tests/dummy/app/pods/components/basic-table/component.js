import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  dynamicColumns: null,
  content: null,
  hideCaption: false,

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
    },

    insertSomeColumns() {
      let newColumns = new Ember.A();
      let columns = this.get('dynamicColumns');

      columns.forEach((c) => {
        let newColumn = {
          label: `New ${c.label}`,
          value: c.value,
          width: 200
        };

        newColumns.addObject(c);
        newColumns.addObject(newColumn);
      });

      this.set('dynamicColumns', newColumns);
    },

    toggleCaption() {
      this.toggleProperty('hideCaption');
    }
  }
});
