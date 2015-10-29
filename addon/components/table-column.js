import Ember from 'ember';
import layout from '../templates/components/table-column';

const { computed, get, isEmpty } = Ember;

export default Ember.Component.extend({
  layout: layout,
  tagName: 'td',

  init() {
    this._super(...arguments);
    this.headerComponent = 'basic-header';
    this.useFakeRowspan = this.useFakeRowspan || false;
    this.resizable = this.resizable || false;
    Ember.assert('Must use table column as a child of table-columns or fixed-table-columns.', this.parentView);
    Ember.run.scheduleOnce('actions', this, this._registerWithParent);
  },

  _value: computed('valueBindingPath', 'row', function() {
    const path = this.get('valueBindingPath');
    const row = this.get('row');
    const hasBlockParams = this.get('hasBlockParams');

    if (hasBlockParams || isEmpty(path) || isEmpty(row)) {
      return null;
    }

    return get(row, path);
  }),

  _registerWithParent() {
    this.parentView.registerColumn(this);
  }
});
