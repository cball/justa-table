import Ember from 'ember';
import layout from '../templates/components/justa-table';

const { empty } = Ember.computed;

export default Ember.Component.extend({
  layout,
  classNames: ['justa-table'],

  /**
    Css classes to apply to table rows.
    @public
  */
  rowClasses: null,

  /**
    If content is empty.
    @public
  */
  noContent: empty('content'),

  actions: {
    /**
      Action triggered when the loader is in view.
      @public
    */
    infinityLoad() {
      this.sendAction('infinityLoad');
    }
  }
});
