import Ember from 'ember';
import layout from '../templates/components/table-column';

const {
  computed,
  get,
  isEmpty,
  run
} = Ember;

export default Ember.Component.extend({
  layout,
  tagName: 'td',
  classNameBindings: ['alignCenter:center', 'alignRight:right'],
  alignCenter: computed.equal('align', 'center'),
  alignRight: computed.equal('align', 'right'),

  /**
    The header component this column should use to render its header.
    @public
  */
  headerComponent: 'basic-header',

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
  */
  resizable: false,

  /**
    If a fake rowspan class should be added when the cell value is empty.
    @public
  */
  useFakeRowspan: false,

  /**
    The registered parent wrapper of this column (TableColumns or FixedTableColumns).
    @private
  */
  _registeredParent: null,

  init() {
    this._super(...arguments);
    Ember.assert('Must use table column as a child of table-columns or fixed-table-columns.', this.parentView);
    run.scheduleOnce('actions', this, this._registerWithParent);
  },

  /**
    Return the value for the cell based on row.valueBindingPath. Only used if
    a block is not passed, the path is provided, and the row is not empty.
    @private
  */
  _value: computed('valueBindingPath', 'row', function() {
    const path = this.get('valueBindingPath');
    const row = this.get('row');
    const hasBlockParams = this.get('hasBlockParams');

    if (hasBlockParams || isEmpty(path) || isEmpty(row)) {
      return null;
    }

    return get(row, path);
  }),

  /**
    Register this column with its parent view.
    @private
  */
  _registerWithParent() {
    let parent = this.get('parentView');
    parent.registerColumn(this);
    this.set('_registeredParent', parent);
  },

  willDestroyElement() {
    let parent = this.get('_registeredParent');
    if (parent) {
      parent.unregisterColumn(this);
    }
  }
});
