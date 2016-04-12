import Ember from 'ember';
import layout from '../templates/components/table-row';

export default Ember.Component.extend({
  layout,
  tagName: 'tr',

  /**
    If this row should render
    @public
  */
  shouldRender: false,
  _shouldRender: false,

  show() {
    if (this._shouldRender) {
      return;
    }
    this.set('shouldRender', true);
    this._shouldRender = true;
  },

  hide() {
    if (!this._shouldRender) {
      return;
    }
    this.set('shouldRender', false);
    this._shouldRender = false;
  },

  willInsertElement() {
    this._super(...arguments);
    // TODO: clean up
    this.element.style.height = this.get('rowHeight.string').replace(/height:\s*/, '');
  },

  willDestroyElement() {
    this._super(...arguments);
    this.set('shouldRender', false);
    this._shouldRender = false;
    this.unregister(this);
  },

  init() {
    this._super(...arguments);
    this.register(this);

    if (!this.get('content.isParent')) {
      this.show();
    }
  }
});
