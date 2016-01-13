import Ember from 'ember';
import layout from '../templates/components/justa-table';

const { empty } = Ember.computed;
const { run, isEmpty } = Ember;

export default Ember.Component.extend({
  layout,
  classNames: ['justa-table'],

  /**
    Css classes to apply to table rows.
    @public
  */
  rowClasses: null,

  /**
    If content is empty.
    @public
  */
  noContent: empty('content'),

  /**
    Name of data property for row groups in the table columns
    @public
  */
  rowGroupDataName: 'data',

  /**
    Ensure header heights are equal. Schedules after render to ensure it's
    called once per table.
    @public
  */
  ensureEqualHeaderHeight() {
    run.scheduleOnce('afterRender', this, this._ensureEqualHeaderHeight);
  },

  /**
    If we have any fixed columns, make sure the fixed columns and standard
    table column header heights stay in sync.
    @private
  */
  _ensureEqualHeaderHeight() {
    let fixedHeader = this.$('.fixed-table-columns th:first-of-type');
    if (isEmpty(fixedHeader)) {
      return;
    }
    let columnHeader = this.$('.table-columns th:first-of-type');
    let maxHeight = Math.max(fixedHeader.height(), columnHeader.height());

    fixedHeader.height(maxHeight);
    columnHeader.height(maxHeight);
  },

  actions: {
    /**
      Action triggered when the loader is in view.
      @public
    */
    infinityLoad() {
      this.sendAction('infinityLoad');
    }
  }
});
