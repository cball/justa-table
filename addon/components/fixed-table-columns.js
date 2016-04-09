import Ember from 'ember';
import layout from '../templates/components/table-columns';
import TableColumns from './table-columns';

const {
  assert,
  run
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
    let width = this.get('tableWidth');
    // height = 500;
    let hasBeenSet = this.get('widthAndPositionSet');
    if (width === 0 || hasBeenSet) {
      return;
    }

    this.$().css({
      width
      // height
    });
    this.set('widthAndPositionSet', true);
  },

  didInsertElement() {
    this._super(...arguments);
    // this.$().bind('wheel', (e) => {
    //   this.$().css('pointer-events', 'none');
    //   // this._updateTableScroll(e);
    //   // run.debounce(this, this._updateTableScroll, e, 50);
    //   run.debounce(this, this._enablePointerEvents, e, 300);
    // });
  },

  _enablePointerEvents() {
    this.$().css('pointer-events', 'auto');
  },

  _updateTableScroll(e) {
    let table = this.get('table').$('.justa-table');
    let newScrollTop = table.scrollTop() + e.originalEvent.deltaY;
    let newScrollLeft = table.scrollLeft() + e.originalEvent.deltaX;

    table.scrollTop(newScrollTop);
    table.scrollLeft(newScrollLeft);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$().unbind('wheel');
  },

  actions: {
    columnWidthChanged() {
      this._super(...arguments);
    }
  }
});
