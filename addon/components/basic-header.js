import Ember from 'ember';
import layout from '../templates/components/basic-header';

const { computed } = Ember;

export default Ember.Component.extend({
  layout,
  tagName: 'th',
  classNameBindings: ['alignCenter:center', 'alignRight:right', 'textWrap'],
  classNames: ['basic-header'],
  alignCenter: computed.equal('column.align', 'center'),
  alignRight: computed.equal('column.align', 'right'),
  textWrap: computed.equal('column.textWrap', true),

  column: null,
  resizable: computed.readOnly('column.resizable'),

  didRender() {
    this._setColumnWidth();
    this.getAttr('table').ensureEqualHeaderHeight();
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
