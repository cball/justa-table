import Ember from 'ember';
import layout from '../templates/components/table-rows';

const {
  Component,
  run,
  get
} = Ember;

export default Ember.Component.extend({
  layout,
  tagName: 'tbody',
  content: null,
  hideOffscreenContent: true,
  topRowIndex: 0,
  bottomRowIndex: 0,
  rowHeight: 37,
  itemClassNames: '',

  _hasInitialized: false,
  _children: null,

  register(child) {
    this.get('_children').addObject(child);

    if (this._hasInitialized) {
      this.scheduleChildrenUpdate();
    }
  },

  unregister(child) {
    let children = this.get('_children');

    if (children) {
      children.removeObject(child);

      if (this._hasInitialized && !this.get('isDestroying') && !this.get('isDestroyed')) {
        this.scheduleChildrenUpdate();
      }
    }
  },

  scheduleChildrenUpdate(args) {
    if (this._hasInitialized) {
      run.scheduleOnce('actions', this, this._updateChildren, args);
    }
  },

  _updateChildren() {
    let children = this.get('_children').sortBy('index');
    if (!get(children, 'length')) {
      return;
    }

    let { topRowIndex, bottomRowIndex } = this.get('table').getVisibleRowIndexes();

    let childrenToHide = children.slice(0, topRowIndex);
    childrenToHide = childrenToHide.concat(children.slice(bottomRowIndex));
    let childrenToShow = children.slice(topRowIndex, bottomRowIndex);

    childrenToHide.forEach((child) => child.hide());
    childrenToShow.forEach((child) => child.show());
  },

  didReceiveAttrs() {
    // this.scheduleChildrenUpdate();
  },

  didInsertElement() {
    this._super(...arguments);
    run.next(() => {
      this._hasInitialized = true;
      this.scheduleChildrenUpdate();
    });
  },

  willDestroy() {
    this._super(...arguments);
    this._destroyCollection();
  },

  willDestroyElement() {
    this._super(...arguments);
    this._destroyCollection();
  },

  _destroyCollection() {
    this.set('content', null);
    this.set('_children', null);
    this.get('table').unregisterRowManager(this);
  },

  init() {
    this._super(...arguments);

    this.set('_children', Ember.A());
    this.get('table').registerRowManager(this);
  }
});
