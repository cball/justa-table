import Ember from 'ember';
import layout from '../templates/components/basic-header';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'th',

  init() {
    this._super(...arguments);
    Ember.run.scheduleOnce('render', this, this._setColumnWidth);
  },

  _setColumnWidth() {
    const width = this.get('column.width');
    if (!width) {
      return;
    }

    this.$().css('width', width);
  }
});
