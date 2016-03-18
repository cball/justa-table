import Ember from 'ember';
import layout from '../templates/components/justa-table';

const {
  Component,
  run,
  isEmpty,
  RSVP,
  assert,
  computed: { empty }
} = Ember;

export default Component.extend({
  layout,
  classNames: ['justa-table'],
  classNameBindings: ['isLoading'],

  init() {
    this._super(...arguments);
    let onLoadMoreRowsAction = this.getAttr('on-load-more-rows');
    if (!onLoadMoreRowsAction) {
      this.attrs['on-load-more-rows'] = RSVP.resolve();
    }
  },

  /**
    The initial / max height of the table, will overflow if rows exceed this
    number.
    @public
  */
  tableHeight: 500,

  /**
    If the table should use pagination. Will fire the 'on-load-more-rows'
    action when it enters the viewport.
    @public
  */
  paginate: false,

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
    let fixedHeader = this.$('.fixed-table-columns-wrapper th:first-of-type');
    if (isEmpty(fixedHeader)) {
      return;
    }
    let columnHeader = this.$('.table-columns th:first-of-type');
    let maxHeight = Math.max(fixedHeader.height(), columnHeader.height());

    fixedHeader.height(maxHeight);
    columnHeader.height(maxHeight);

    this._resizeTable();
  },

  /**
    Sets the table height before rendering. If the height of the rows is less
    than the specified tableHeight, it will resize.
    @private
  */
  _resizeTable() {
    let requestedHeight = this.get('tableHeight');
    let actualHeight = this.$('table').outerHeight();
    this.$().height(Math.min(requestedHeight, actualHeight));
  },

  /**
    Queues sending 'didRenderTable' action. This is called once the columns
    have rendered data.
    @public
  */
  didRenderCollection() {
    run.scheduleOnce('afterRender', this, this._sendRenderAction);
  },

  /**
    Sends 'didRenderTable' closure action if present
    @private
  */
  _sendRenderAction() {
    let didRenderAction = this.get('didRenderTable');

    if (didRenderAction) {
      assert(`didRenderAction must be passed as a closure action. You passed ${didRenderAction}`, typeof didRenderAction === 'function');
      didRenderAction(this);
    }
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.ensureEqualHeaderHeight();
  },

  didInsertElement() {
    let columns = this.$('.table-columns');

    columns.scroll((e) => {
      columns.not(e.target).scrollTop(e.target.scrollTop);
    });
  },

  willDestroyElement() {
    this.$('.table-columns').off('scroll');
  },

  /**
    Returns the width of the fixed columns in this table. If there
    are no fixed columns, returns 0;
    @public
  */
  fixedColumnWidth() {
    // TODO: register children explicitly and don't use child views.
    let fixedColumnsComponent = this.get('childViews').find((view) => {
      return view.classNames.contains('fixed-table-columns-wrapper');
    });

    return fixedColumnsComponent ? fixedColumnsComponent.get('tableWidth') : 0;
  },

  actions: {
    viewportEntered() {
      if (this.getAttr('on-load-more-rows')) {
        let returnValue = this.getAttr('on-load-more-rows');
        let isFunction  = typeof returnValue === 'function';

        Ember.assert('on-load-more-rows must use a closure action', isFunction);

        let promise = this.attrs['on-load-more-rows']();

        if (!promise.then) {
          promise = new RSVP.Promise((resolve) => {
            resolve(false);
          });
        }

        promise.finally(() => this.set('isLoading', false));
        return promise;
      }
    }
  }
});
