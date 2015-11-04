import Ember from 'ember';
import layout from '../templates/components/justa-table';

const { empty } = Ember.computed;

export default Ember.Component.extend({
  layout,
  classNames: ['justa-table'],

  noContent: empty('content'),

  actions: {
    infinityLoad() {
      this.sendAction('infinityLoad');
    }
  }
});
