import Ember from 'ember';
import layout from '../templates/components/justa-table';

const {
  A,
  Component,
  run,
  isEmpty,
  isPresent,
  RSVP,
  assert,
  get,
  getWithDefault,
  set,
  setProperties,
  computed,
  computed: { empty }
} = Ember;

export default Component.extend({
  layout,
  classNames: ['justa-table'],
  classNameBindings: ['isLoading', 'stickyHeaders', 'isWindows'],

  init() {
    this._super(...arguments);

    let onLoadMoreRowsAction = this.getAttr('on-load-more-rows');
    if (!onLoadMoreRowsAction) {
      this.attrs['on-load-more-rows'] = RSVP.resolve();
    }
  },

  /**
    Adds a dynamic key based on rowGroupDataName that recomputes the
    collapseTableData. Only adds the key if using a collapsable table.
    @private
  */
  _addRowGroupDataNamePropertyKey() {
    let rowGroupDataName = this.get('rowGroupDataName');
    this.get('collapseTableData').property(`content.@each.${rowGroupDataName}`);
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
    let columnHeader = this.$('.table-columns-wrapper:not(.fixed-table-columns-wrapper) th:first-of-type');
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
    // TODO reenable with better height logic for tables without many rows
    // let requestedHeight = this.get('tableHeight');
    // let actualHeight = this.$('.table-columns table').outerHeight();
    // let totalHeight = Math.min(requestedHeight, actualHeight);

    // this.$().height(totalHeight);
    // this.$('.table-columns').height(totalHeight);
  },

  /**
    Windows machines need slightly different css for scrollable containers.
    Returns a boolean that is applied as a classNameBinding to the justa-table
    div.
    @public
  */
  isWindows: computed(function() {
    let hasWindowsString = navigator.userAgent.match(/Windows/i);

    return isPresent(hasWindowsString);
  }),

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
    this._super(...arguments);
    this._setupListeners();
  },

  /**
    Sets up scroll and resize listeners.
    @private
  */
  _setupListeners() {
    this._setupScrollListeners();
    this._setupResizeListener();
  },

  /**
    When columns are scrolled, scroll any other columns as well.
    Keeps fixed columns in sync.
    @private
  */
  _setupScrollListeners() {
    let columns = this.$('.table-columns');

    columns.scroll((e) => {
      this._setupStickyHeaders();
      columns.not(e.target).scrollTop(e.target.scrollTop);
    });
  },

  _setupStickyHeaders() {
    let hasSetupStickyHeaders = this.get('hasSetupStickyHeaders');
    if (hasSetupStickyHeaders) {
      return;
    }

    let usingStickyHeaders = this.get('stickyHeaders');

    if (usingStickyHeaders) {
      this.set('hasSetupStickyHeaders', true);

      window.requestAnimationFrame(() => {
        this.$('table').floatThead({
          position: 'absolute',
          scrollContainer($table) {
            return $table.closest('.table-columns');
          }
        });
      });
    }
  },

  /**
    Rerenders the table on browser resize.
    @private
  */
  _setupResizeListener() {
    this._resizeHandler = () => {
      this.rerender();
    };

    window.addEventListener('resize', this._resizeHandler, true);
  },

  willDestroyElement() {
    window.removeEventListener('resize', this._resizeHandler, true);
    this._resizeHandler = null;

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

  collapseTableData: computed('content', function() {
    if (!get(this, 'collapsable')) {
      return;
    }

    let rows = new A(get(this, 'content')).toArray();
    let rowGroupDataName = get(this, 'rowGroupDataName');
    let formattedRows = new A();

    for (let i = 0; i < get(rows, 'length'); i++) {
      let row = rows[i];
      let collapsed = getWithDefault(row, 'isCollapsed', true);

      setProperties(row, {
        isParent: true,
        isCollapsed: collapsed
      });

      let children = new A(get(row, rowGroupDataName));
      children.setEach('parent', row);

      formattedRows.pushObject(row);

      if (!collapsed) {
        formattedRows.pushObjects(children);
      }
    }

    return formattedRows;
  }),

  actions: {
    toggleRowCollapse(rowGroup) {
      let isNotParent = !get(rowGroup, 'isParent');
      if (isNotParent || !get(this, 'onRowExpand')) {
        return;
      }

      let isCollapsed = get(rowGroup, 'isCollapsed');
      let object = get(this, 'content').find((item) => {
        return item === rowGroup;
      });
      let objectCollapsed = get(object, 'isCollapsed');

      if (Ember.isNone(objectCollapsed)) {
        set(object, 'isCollapsed', false);
      } else {
        set(object, 'isCollapsed', !objectCollapsed);
      }

      // TODO make this smarter by taking option if we should do this
      isCollapsed = get(object, 'isCollapsed');
      let rowData = get(object, this.get('rowGroupDataName'));
      let shouldFetch = isEmpty(rowData) && !isCollapsed;

      // TODO: avoid recomputing content when we just change part of it
      if (shouldFetch) {
        set(object, 'loading', true);
        this.attrs.onRowExpand(object).then((data) => {
          set(object, this.get('rowGroupDataName'), rowData.concat(data));
          this.notifyPropertyChange('content');
        }).finally(() => {
          set(object, 'loading', false);
        });
      } else {
        this.notifyPropertyChange('content');
      }
    },

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
