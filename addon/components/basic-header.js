import Ember from 'ember';
import layout from '../templates/components/basic-header';

const { computed } = Ember;

export default Ember.Component.extend({
  layout,
  tagName: 'th',
  attributeBindings: ['scope'],
  classNameBindings: ['alignCenter:center', 'alignRight:right', 'textWrap'],
  alignCenter: computed.equal('column.align', 'center'),
  alignRight: computed.equal('column.align', 'right'),
  textWrap: computed.equal('column.textWrap', true),

  column: null,
  resizable: computed.readOnly('column.resizable'),

  /**
   * Accessability attribute that, for screen readers, unambiguously establishes
   * the cells that the header comprised by this <th> element relates to.
   * @see: http://webaim.org/techniques/tables/data#scope
   */
  scope: 'col',

  didRender() {
    let table = this.get('table');
    this._setColumnWidth();
    table.ensureEqualHeaderHeight();
  },

  updateColumnWidths: Ember.observer('column.width', function() {
    let table = this.get('table');
    table.columnWidthsChanged();
  }),

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
