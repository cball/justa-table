import Ember from 'ember';
import layout from '../templates/components/basic-header';

const { computed, run } = Ember;

export default Ember.Component.extend({
  layout,
  tagName: 'th',
  classNameBindings: ['alignCenter:center', 'alignRight:right', 'textWrap'],
  alignCenter: computed.equal('column.align', 'center'),
  alignRight: computed.equal('column.align', 'right'),
  textWrap: computed.equal('column.textWrap', true),

  column: null,
  resizable: computed.readOnly('column.resizable'),

  didReceiveAttrs() {
    this._super(...arguments);

    let columns = this.get('parentView');
    run.scheduleOnce('actions', columns, columns.reflowStickyHeaders);
  },

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
