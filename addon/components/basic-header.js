import Ember from 'ember';
import layout from '../templates/components/basic-header';

const { computed } = Ember;

export default Ember.Component.extend({
  layout,
  tagName: 'th',

  column: null,
  resizable: computed.readOnly('column.resizable'),

  didRender() {
    this._setColumnWidth();
  },

  _setColumnWidth() {
    const width = this.get('column.width');
    if (!width) {
      return;
    }

    this.element.style.width = `${width}px`;
  },

  actions: {
    onColumnWidthChange() {
      this._setColumnWidth();
      this.attrs.onColumnWidthChange();
    }
  }
});
