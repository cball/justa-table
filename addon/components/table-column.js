import Ember from 'ember';
import layout from '../templates/components/table-column';
import Table from './justa-table';
import TableColumns from './table-columns';

const {
  A,
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

  table: computed(function() {
    // TODO: do without private function
    return this.nearestOfType(Table);
  }).volatile(),

  columns: computed(function() {
    // TODO: do without private function
    return this.nearestOfType(TableColumns);
  }).volatile(),

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

  shouldUseFakeRowspan: computed('row', 'useFakeRowspan', 'valueBindingPath', function() {
    let { row, valueBindingPath } = getProperties(this, ['row', 'valueBindingPath']);
    if (!row || !valueBindingPath || get(this, 'hasBlock')) {
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
    let value = getWithDefault(this, `row.${valueBindingPath}`, '');

    return getWithDefault(this, 'title', value);
  }),

  /**
    The registered parent wrapper of this column (TableColumns or FixedTableColumns).
    @private
  */
  _registeredParent: null,

  init() {
    this._super(...arguments);
    assert('Must use table column as a child of table-columns or fixed-table-columns.', this.get('table'));
    run.scheduleOnce('sync', this, this._registerWithParent);
  },

  didReceiveAttrs() {
    this._super(...arguments);

    if (this.get('groupWithPriorRow')) {
      run.scheduleOnce('sync', this, this._groupWithPriorRow);
    }
  },

  /**
    Register this column with its parent table.
    @private
  */
  _registerWithParent() {
    let tableColumns = this.get('columns');
    tableColumns.registerColumn(this);
    this.set('_registeredParent', tableColumns);
  },

  _groupWithPriorRow() {
    let rows = new A(get(this, 'table.content'));
    let currentRow = get(this, 'row');
    let index = rows.indexOf(currentRow);
    let previousRow = rows.objectAt(index - 1);
    let valueBindingPath = get(this, 'valueBindingPath');

    if (!previousRow) {
      return;
    }

    let previousValue = get(previousRow, valueBindingPath);
    let currentValue = getWithDefault(this, `row.${valueBindingPath}`, '');

    if (isEmpty(previousValue) || previousValue === currentValue) {
      this.set('valueBindingPath', 'blankCell');
    }
  },

  willDestroyElement() {
    this._super(...arguments);
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
    this.set('_registeredParent', null);
  }
});
