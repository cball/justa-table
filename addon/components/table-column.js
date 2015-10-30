import Ember from 'ember';
import layout from '../templates/components/table-column';

const {
  computed,
  get,
  isEmpty,
  run
} = Ember;

export default Ember.Component.extend({
  layout,
  tagName: 'td',

  headerComponent: 'basic-header',
  width: 0,
  minWidth: 0,
  useFakeRowspan: false,
  resizable: false,

  init() {
    this._super(...arguments);
    Ember.assert('Must use table column as a child of table-columns or fixed-table-columns.', this.parentView);
    run.scheduleOnce('actions', this, this._registerWithParent);
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
    this.get('parentView').registerColumn(this);
  },

  willDestroyElement() {
    this.get('parentView').unregisterColumn(this);
  }
});
