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

// TODO: actually measure this
const HORIZONTAL_SCROLLBAR_HEIGHT = 16;
const DEFAULT_ROW_HEIGHT = 37;
const DEFAULT_OFFSCREEN_CONTENT_BUFFER_SIZE = 0.5;

// TODO: this should probably go in its own class somewhere
// I separated this into a function becuase its used multiple times
let collapseRowGroup = function(rowGroup) {
  let collapsed = get(rowGroup, 'isCollapsed');

  if (Ember.isNone(collapsed)) {
    set(rowGroup, 'isCollapsed', false);
  } else {
    set(rowGroup, 'isCollapsed', !rowGroup.isCollapsed);
  }
};

export default Component.extend(InViewportMixin, {
  layout,
  classNames: ['justa-table'],
  classNameBindings: ['isLoading', 'stickyHeaders', 'isWindows'],
  browser: service(),
  _rowManagers: null,

  init() {
    this._super(...arguments);
    this.set('rowHeight', this.rowHeight || DEFAULT_ROW_HEIGHT);
    this.set('_rowManagers', A([]));

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
   * A caption for the table. If supplied, this will be inserted into
   * a <caption> tag as the first-child node of the <table>
   * @public
   */
  caption: null,

  /**
   * "left", "center", or "right" text alignment for the caption
   * @public
   */
  captionAlignment: null,

  /**
   * Support hiding the caption from view, but still rendering it
   * for accessibility.
   */
  hideCaption: false,

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
    run.next(this, this._ensureEqualHeaderHeight);
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

  _reflowStickyHeaders() {
    this.$('table').floatThead('reflow');
  },

  /**
    Sets the table height before rendering. If the height of the rows is less
    than the specified tableHeight, it will resize.
    @private
  */
  _resizeTable() {
    let requestedHeight = this.get('tableHeight');
    let actualHeight = this.$('.standard-table-columns-wrapper .table-columns table').outerHeight();
    let totalHeight = actualHeight === 0 ? requestedHeight : Math.min(requestedHeight, actualHeight);
    let isWindows = this.get('isWindows');
    let shouldAddHeightBuffer = isWindows && this.get('isIE') && this._hasHorizontalScroll();

    run.next(() => {
      if (this._hasHorizontalScroll()) {
        totalHeight = totalHeight + HORIZONTAL_SCROLLBAR_HEIGHT;
      }

      this.$().height(totalHeight);
      // windows does not respect the height set, so it needs a 2px buffer if horizontal scrollbar
      this.$('.table-columns').height(shouldAddHeightBuffer ? totalHeight + 2 : totalHeight);

      this.set('containerSize', totalHeight);
    });
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

  isIE: computed(function() {
    return this.get('browser.browserInfo.vendor') === 'ie' && this.get('browser.browserInfo.version') < 11;
  }),

  content: computed({
    get() {
      return this.get('_content');
    },
    set(key, value) {
      this.set('_content', value);

      if (!this.get('isDestroying') && !this.get('isDestroyed')) {
        run.scheduleOnce('afterRender', this, this._scrollToTop);
      }
      return value;
    }
  }),

  _content: null,

  _scrollToTop() {
    this.$('.table-columns').scrollTop(0, 0);
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

    this.ensureEqualHeaderHeight();
  },

  didReceiveAttrs(attrs) {
    this._super(...arguments);
    this.ensureEqualHeaderHeight();

    if (this._didContentLengthChange(attrs)) {
      this._resizeTable();
    }
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

  didInsertElement() {
    this._super(...arguments);
    this._setupListeners();
    this._resizeTable();
    run.later(this, this._setupStickyHeaders, 500);
  },

  /**
    Sets up scroll and resize listeners.
    @private
  */
  _setupListeners() {
    this._setupScrollListeners();
    this._setupResizeListener();
    this._setupWheelListener();
  },

  /**
    When columns are scrolled, scroll any other columns as well.
    Keeps fixed columns in sync.
    @private
  */
  _setupScrollListeners() {
    let columns = this.$('.table-columns');
    let hideOffscreenContent = this.get('hideOffscreenContent');

    columns.scroll((e) => {
      columns.not(e.target).scrollTop(e.target.scrollTop);

      if (hideOffscreenContent) {
        this.get('_rowManagers').invoke('scheduleChildrenUpdate');
      }
    });
  },

  _setupWheelListener() {
     let scrollContainer = this.$('.standard-table-columns-wrapper .table-columns');
     this.$().bind('wheel', (event) => {
       // TODO: jquery.mousewheel to help normalize scrolling?
       let newScrollTop = scrollContainer.scrollTop() + event.originalEvent.deltaY;
       let newScrollLeft = scrollContainer.scrollLeft() + event.originalEvent.deltaX;

       scrollContainer.scrollTop(newScrollTop);
       scrollContainer.scrollLeft(newScrollLeft);

       // firefox needs this or we cant scroll fixed columns
       event.preventDefault();
     });
   },

  /**
    Determines the visible row count based on row height, table height, and
    containerSize.
    @public
  */
  visibleRowCount: computed('rowHeight', 'tableHeight', 'content.length', 'collapseTableData.length', 'containerSize', function() {
    let hideOffscreenContent = this.get('hideOffscreenContent');
    let collapsable = this.get('collapsable');

    if (!hideOffscreenContent) {
      return collapsable ? this.get('collapseTableData.length') : this.get('content.length');
    }

    let rowHeight = this.get('rowHeight');
    let { tableHeight, containerSize, offscreenContentBufferSize } = this.getProperties('tableHeight', 'containerSize', 'offscreenContentBufferSize');
    let shouldUseTableHeight = isEmpty(containerSize) || containerSize === 0;
    let height = shouldUseTableHeight ? tableHeight : containerSize;

    return Math.ceil(height / rowHeight * (1 + offscreenContentBufferSize));
  }),

  getVisibleRowIndexes() {
    let hideOffscreenContent = this.get('hideOffscreenContent');
    let collapsable = this.get('collapsable');

    if (!hideOffscreenContent) {
      let bottomRowIndex = collapsable ? this.get('collapseTableData.length') : this.get('content.length');

      return {
        topRowIndex: 0,
        bottomRowIndex
      };
    }

    let columnDiv = this.$('.standard-table-columns-wrapper .table-columns');
    let scrollTop = !columnDiv || columnDiv.length === 0 ? 0 : columnDiv.scrollTop();
    let { rowHeight, visibleRowCount, offscreenContentBufferSize } = this.getProperties('rowHeight', 'visibleRowCount', 'offscreenContentBufferSize');
    let topRowIndex = Math.floor(scrollTop / rowHeight);
    let bufferedTopRowIndex = Math.max(0, topRowIndex - Math.floor(visibleRowCount * offscreenContentBufferSize));
    let bottomRowIndex = topRowIndex + visibleRowCount;

    return {
      topRowIndex: bufferedTopRowIndex,
      bottomRowIndex
    };
  },

  registerRowManager(rowManager) {
    this.get('_rowManagers').addObject(rowManager);
  },

  unregisterRowManager(rowManager) {
    this.get('_rowManagers').removeObject(rowManager);
  },

  _setupStickyHeaders() {
    let hasSetupStickyHeaders = this.get('hasSetupStickyHeaders');
    if (hasSetupStickyHeaders) {
      return;
    }

    let usingStickyHeaders = this.get('stickyHeaders');

    if (usingStickyHeaders) {
      this.set('hasSetupStickyHeaders', true);

      requestAnimationFrame(() => {
        let table = this.$('table');
        if (table) {
          table.floatThead({
            position: 'absolute',
            scrollContainer($table) {
              return $table.closest('.table-columns');
            }
          });
        }
        this.didEnterViewport();
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
    this._content = null;

    this.$('.table-columns').off('scroll');
    this.$().off('wheel');
  },

  /**
    Returns the width of the fixed columns in this table. If there
    are no fixed columns, returns 0;
    @public
  */
  fixedColumnWidth() {
    // TODO: register children explicitly and don't use child views.
    let fixedColumnsComponent = this.get('childViews').find(view => {
      return view.classNames.includes('fixed-table-columns-wrapper');
    });

    return fixedColumnsComponent ? fixedColumnsComponent.get('tableWidth') : 0;
  },

  collapseTableData: computed('content', function() {
    if (!get(this, 'collapsable')) {
      return;
    }

    let rows = A(get(this, 'content')).toArray();
    let rowGroupDataName = get(this, 'rowGroupDataName');
    let formattedRows = A();

    for (let i = 0; i < get(rows, 'length'); i++) {
      let row = rows[i];
      let collapsed = getWithDefault(row, 'isCollapsed', true);

      setProperties(row, {
        isParent: true,
        isCollapsed: collapsed
      });

      let children = A(get(row, rowGroupDataName));
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
    let browser = this.get('browser.browserInfo.browser');

    if (isWindows && browser === 'chrome') {
      let height = this.$().height() + Math.round(Math.random() * 10);
      run.next(() => {
        this.set('containerSize', height);
      });
    }
  },

  actions: {
    toggleRowCollapse(rowGroup) {
      if (!get(this, 'collapsable')) {
        return;
      }

      let isNotParent = !get(rowGroup, 'isParent');
      if (isNotParent || !get(this, 'onRowExpand')) {
        return;
      }

      let isCollapsed = get(rowGroup, 'isCollapsed');
      let object = get(this, 'content').find((item) => {
        return item === rowGroup;
      });

      let objectCollapsed = get(object, 'isCollapsed');

      // TODO: Separate this logic out somehow, this closes all open
      // groups when you open another. for accordian grouping...
      let isAccordian = get(this, 'accordian');

      // NOTE: if accordian is passed to the table as true. close all other
      // groups when opening another one.
      if (isAccordian) {
        object.filter(function(item) {
          return !item.isCollapsed;
        }).forEach((row) => {
          if (row.label !== rowGroup.label) {
            collapseRowGroup(row);
          }
        });
      }

      collapseRowGroup(objectCollapsed);
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

      this.get('_rowManagers').invoke('scheduleChildrenUpdate');
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
