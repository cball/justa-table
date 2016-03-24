import Ember from 'ember';
import layout from '../templates/components/table-columns';
import TableColumns from './table-columns';

const {
  assert
} = Ember;

export default TableColumns.extend({
  layout,
  columnType: 'fixed',

  init() {
    this._super(...arguments);
    assert('fixed columns cannot be resizable', !this.resizable);
  },

  /**
    Fixed table columns set the wrapper width to the entire table width,
    and are always positioned at 0,0.
    @private
  */
  _setTableWidthAndPosition() {
    let tableWidth = this.get('tableWidth');
    let hasBeenSet = this.get('widthAndPositionSet');
    if (tableWidth === 0 || hasBeenSet) {
      return;
    }

    this.$().css('width', tableWidth);
    this.set('widthAndPositionSet', true);
  },

  actions: {
    columnWidthChanged() {
      this._super(...arguments);
    }
  }
});
