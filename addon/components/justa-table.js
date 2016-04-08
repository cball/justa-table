import Ember from 'ember';
import layout from '../templates/components/justa-table';
import InViewportMixin from 'ember-in-viewport/mixins/in-viewport';

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
  computed: { empty },
  inject: { service }
} = Ember;

const HORIZONTAL_SCROLLBAR_HEIGHT = 15;
const DEFAULT_ROW_HEIGHT = 37;
const DEFAULT_OFFSCREEN_CONTENT_BUFFER_SIZE = 0.5;

export default Component.extend(InViewportMixin, {
  layout,
  classNames: ['justa-table-wrapper'],
  browser: service(),

  init() {
    this._super(...arguments);
    this.set('rowHeight', this.rowHeight || DEFAULT_ROW_HEIGHT);

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
    Adds a dynamic key based on rowGroupDataName that recomputes the
    collapseTableData. Only adds the key if using a collapsable table.
    @private
  */
  _addRowGroupDataNamePropertyKey() {
    let rowGroupDataName = this.get('rowGroupDataName');
    this.get('collapseTableData').property(`content.@each.${rowGroupDataName}`);
  },

  /**
    If we should hide out of viewport content (vertical only for now).
    TODO: make this true and rip out S&M.
    @public
    @default false
  */
  hideOffscreenContent: false,

  /**
    The amount of additonal rows to load on top/bottom of the viewport when
    hiding offscreen content. Will round up/down to the nearest row.
    @public
    @default 0.5
  */
  offscreenContentBufferSize: DEFAULT_OFFSCREEN_CONTENT_BUFFER_SIZE,

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

  columnWidthsChanged() {
    run.scheduleOnce('sync', this, this._reflowStickyHeaders);
  },

  // _reflowStickyHeaders() {
  //   this.$('table').floatThead('reflow');
  // },

  /**
    Sets the table height before rendering. If the height of the rows is less
    than the specified tableHeight, it will resize.
    @private
  */
  _resizeTable() {
    let requestedHeight = this.get('tableHeight');
    let actualHeight = this.$('.table-columns table').outerHeight();
    let totalHeight = actualHeight === 0 ? requestedHeight : Math.min(requestedHeight, actualHeight);
    let isWindows = this.get('isWindows');
    let shouldAddHeightBuffer = isWindows && this._hasHorizontalScroll();

    if (false) {
      totalHeight = totalHeight + HORIZONTAL_SCROLLBAR_HEIGHT;
    }

    this.$('justa-table').height(totalHeight);
    // windows does not respect the height set, so it needs a 2px buffer if horizontal scrollbar
    // this.$('.table-columns').height(shouldAddHeightBuffer ? totalHeight + 2 : totalHeight);
  },

  _hasHorizontalScroll() {
    let tableWidth = this.$('.standard-table-columns-wrapper table').outerWidth();
    let containerWidth = this.$('.standard-table-columns-wrapper .table-columns').outerWidth();

    return tableWidth > containerWidth;
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

  content: computed({
    get() {
      return this.get('_content');
    },
    set(key, value) {
      this.set('_content', value);
      run.scheduleOnce('afterRender', this, this._scrollToTop);
      return value;
    }
  }),

  _content: null,

  _scrollToTop() {
    this.$('.justa-table').scrollTop(0, 0);
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

  didReceiveAttrs(attrs) {
    this._super(...arguments);
    this.ensureEqualHeaderHeight();
    this._updateVisibleRowIndexes();

    if (this._didContentLengthChange(attrs)) {
      this._resizeTable();
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this._setupListeners();
    this._resizeTable();
  },

  /**
    Returns true if the content length has changed (rows added/removed)
    @private
  */
  _didContentLengthChange(attrs) {
    let oldLength = get(attrs, 'oldAttrs.content.value.length');
    let newLength = get(attrs, 'newAttrs.content.value.length');

    return oldLength && oldLength !== newLength;
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
    let table = this.$('.justa-table');

    table.scroll(() => {
      // this._setupStickyHeaders();
      // columns.not(e.target).scrollTop(e.target.scrollTop);
      // run.scheduleOnce('sync', this, this._updateVisibleRowIndexes);
      run.debounce(this, this._updateVisibleRowIndexes, 20);
    });
  },

  // _setupStickyHeaders() {
  //   let hasSetupStickyHeaders = this.get('hasSetupStickyHeaders');
  //   if (hasSetupStickyHeaders) {
  //     return;
  //   }
  //
  //   let usingStickyHeaders = this.get('stickyHeaders');
  //
  //   if (usingStickyHeaders) {
  //     this.set('hasSetupStickyHeaders', true);
  //
  //     window.requestAnimationFrame(() => {
  //       this.$('table').floatThead({
  //         position: 'absolute',
  //         scrollContainer($table) {
  //           return $table.closest('.justa-table');
  //         }
  //       });
  //       this.didEnterViewport();
  //     });
  //   }
  // },

  /**
    Determines the visible row count based on row height, table height, and
    containerSize.
    @public
  */
  visibleRowCount: computed('rowHeight', 'tableHeight', 'content.length', 'containerSize', function() {
    let rowHeight = this.get('rowHeight');
    let { tableHeight, containerSize, offscreenContentBufferSize } = this.getProperties('tableHeight', 'containerSize', 'offscreenContentBufferSize');
    let shouldUseTableHeight = isEmpty(containerSize) || containerSize === 0;
    let height = shouldUseTableHeight ? tableHeight : containerSize;

    return Math.ceil(height / rowHeight * (1 + offscreenContentBufferSize));
  }),

  /**
    Sets topRowIndex and bottomRowIndex based on what is in the viewport.
    @private
  */
  _updateVisibleRowIndexes() {
    window.requestAnimationFrame(() => {
      let columnDiv = this.$('.justa-table');
      let scrollTop = !columnDiv || columnDiv.length === 0 ? 0 : columnDiv.scrollTop();
      let { rowHeight, visibleRowCount, offscreenContentBufferSize } = this.getProperties('rowHeight', 'visibleRowCount', 'offscreenContentBufferSize');
      let topRowIndex = Math.floor(scrollTop / rowHeight);
      let bufferedTopRowIndex = Math.max(0, topRowIndex - Math.floor(topRowIndex * offscreenContentBufferSize));
      let bottomRowIndex = topRowIndex + visibleRowCount;

      // TODO: move to model
      this.setProperties({
        topRowIndex: bufferedTopRowIndex,
        bottomRowIndex
      });
    });
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

  rowHeightStyle: computed('rowHeight', function() {
    let rowHeight = getWithDefault(this, 'rowHeight', DEFAULT_ROW_HEIGHT).toString();
    rowHeight = rowHeight.replace(/px/, '');

    return new Ember.Handlebars.SafeString(`height: ${rowHeight}px;`);
  }),

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

  didEnterViewport() {
    let isWindows = this.get('isWindows');
    let { browser } = this.get('browser.browserInfo');

    if (isWindows && browser === 'chrome') {
      let height = this.$().height() + Math.round(Math.random() * 10);
      run.next(() => {
        this.set('containerSize', height);
      });
    }
  },

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
