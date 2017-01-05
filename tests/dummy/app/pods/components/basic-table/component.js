import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  dynamicColumns: null,
  content: null,
  hideCaption: false,

  init() {
    this._super(...arguments);

    this.dynamicColumns = Ember.A([
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
    ]);
  },

  actions: {
    removeAColumn() {
      this.get('dynamicColumns').popObject();
    },

    removeSomeRows() {
      this.sendAction('removeSomeRows');
    },

    insertSomeColumns() {
      let dynamicColumns = this.get('dynamicColumns');

      if (!dynamicColumns.length) {
        dynamicColumns.addObject({
          label: 'Dynamic 1',
          value: 'one',
          width: 250
        });
      } else {

        let newColumns = Ember.A();

        dynamicColumns.forEach(c => {
          let newColumn = {
            label: `New ${c.label}`,
            value: c.value,
            width: 200
          };

          newColumns.addObject(c);
          newColumns.addObject(newColumn);
        });

        this.set('dynamicColumns', newColumns);
      }
    },

    toggleCaption() {
      this.toggleProperty('hideCaption');
    }
  }
});
