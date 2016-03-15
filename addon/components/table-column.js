import Ember from 'ember';
import layout from '../templates/components/table-column';

const {
  Component,
  computed,
  get,
  getWithDefault,
  getProperties,
  isEmpty,
  run,
  assert
} = Ember;

export default Component.extend({
  layout,
  tagName: 'td',
  attributeBindings: ['cellTitle:title'],
  classNameBindings: ['alignCenter:center', 'alignRight:right', 'shouldUseFakeRowspan:fake-rowspan'],
  alignCenter: computed.equal('align', 'center'),
  alignRight: computed.equal('align', 'right'),
  /**
    The header component this column should use to render its header.
    @public
    @default 'basic-header'
  */
  headerComponent: 'basic-header',

  /**
    Rows whose value matches the prior row will be returned as null
    resulting in them appearing grouped
    @public
  */
  groupWithPriorRow: false,

  /**
    The width of this column in pixels.
    @public
  */
  width: 0,

  /**
    The minimum width this column can be. Only used when resize is true.
    @public
  */
  minWidth: 0,

  /**
    If the table column is resizable.
    @public
    @default false
  */
  resizable: false,

  /**
    If a fake rowspan class should be added when the cell value is empty.
    @public
    @default false
  */
  useFakeRowspan: false,

  blankCell: '',

  parentTable: computed('parentView', function() {
    return this.get('parentView.parentView.parentView');
  }),

  shouldUseFakeRowspan: computed('useFakeRowspan', function() {
    let { row, valueBindingPath } = getProperties(this, ['row', 'valueBindingPath']);

    if (!valueBindingPath || get(this, 'hasBlock')) {
      return;
    }

    let value = get(row, valueBindingPath);
    let useFakeRowspan = get(this, 'useFakeRowspan');

    return useFakeRowspan && isEmpty(value);
  }),

  /**
    Return the title attribute for the tag with the cell value.
    If a title attribute is specified, it is used. Otherwise, title defaults to
    the value of row.valueBindingPath, returning a blank string if not found.
    @public
  */
  cellTitle: computed('title', 'valueBindingPath', function() {
    let valueBindingPath = get(this, 'valueBindingPath');
    return getWithDefault(this, `row.${valueBindingPath}`, '');
  }),

  /**
    The registered parent wrapper of this column (TableColumns or FixedTableColumns).
    @private
  */
  _registeredParent: null,

  init() {
    this._super(...arguments);
    assert('Must use table column as a child of table-columns or fixed-table-columns.', this.get('parentTable'));
    run.scheduleOnce('actions', this, this._registerWithParent);

    if (this.get('groupWithPriorRow')) {
      run.scheduleOnce('actions', this, this._groupWithPriorRow);
    }
  },

  /**
    Register this column with its parent table.
    @private
  */
  _registerWithParent() {
    // temp hack since we're no longer a direct child
    let table = this.get('parentTable');
    table.registerColumn(this);
    this.set('_registeredParent', table);
  },

  _groupWithPriorRow() {
    let valueBindingPath = get(this, 'valueBindingPath');
    let value = getWithDefault(this, `row.${valueBindingPath}`, '');

    // vertical-item > vertical-collection > table-columns
    // TODO replace with something better
    let parentView = this.get('parentTable');
    let lastValue = parentView.get(`values.${valueBindingPath}`);

    if (value === lastValue) {
      this.set('valueBindingPath', 'blankCell');
    } else {
      parentView.set(`values.${valueBindingPath}`, value);
    }
  },

  willDestroyElement() {
    let parent = this.get('_registeredParent');
    if (parent) {
      run.scheduleOnce('actions', this, this._unregisterWithParent, parent);
    }
  },

  /**
    Unregister this column with its parent table.
    @private
  */
  _unregisterWithParent(parent) {
    parent.unregisterColumn(this);
  }
});
