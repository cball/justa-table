import Ember from 'ember';
import layout from '../templates/components/justa-table';

const { later } = Ember.run;
const { empty } = Ember.computed;

export default Ember.Component.extend({
  layout: layout,
  classNames: ['justa-table'],
  noContent: empty('content'),

  didInsertElement() {
    later(() => {
      // only non-fixed columns are resizable
      // this.$('.table-columns table').resizableColumns();
    }, 500);
  },

  willDestroyElement() {
    // this.$('table').data('resizableColumns').destroy();
  },

  actions: {
    infinityLoad() {
      this.sendAction('infinityLoad');
    }
  }
});
