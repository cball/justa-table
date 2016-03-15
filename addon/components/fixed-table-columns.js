import Ember from 'ember';
import layout from '../templates/components/table-columns';
import TableColumns from './table-columns';

const { computed } = Ember;

export default TableColumns.extend({
  layout,

  init() {
    this._super(...arguments);
    this.classNames = ['fixed-table-columns'];
  },

  columnWidths: computed.mapBy('columns', 'width'),
  columnBorderWidths: computed('columns.[]', function columnBorderWidths() {
    return this.get('columns').map((column) => {
      let style = getComputedStyle(column.element);
      return parseInt(style.borderRightWidth, 10) + parseInt(style.borderLeftWidth, 10);
    });
  }),

  tableWidth: computed('columnWidths.[]', 'columnBorderWidths.[]', function tableWidth() {
    let array = this.get('columnWidths').concat(this.get('columnBorderWidths'));
    return Ember.String.htmlSafe(array.reduce((sum, item) => sum + item, 0));
  }),

  didRender() {
    this._super(...arguments);
    this._setTableWidth();
  },

  _setTableWidth() {
    this.$('> table').css('width', `${this.get('tableWidth')}px`);
  },

  actions: {
    didRenderTable() {
      this.sendAction('didRenderTable', this);
    },
    columnWidthChanged() {
      this._super(...arguments);
      this._setTableWidth();
    }
  }
});
