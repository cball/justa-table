import Ember from 'ember';
import $ from 'jquery';

const { computed, uuid } = Ember;

export default Ember.Component.extend({
  classNames: ['resize-handle'],

  column: null,

  eventNamespace: computed({
    get() {
      return `.rc${uuid()}`;
    }
  }),

  didInsertElement() {
    const eventNamespace = this.get('eventNamespace');
    const eventString = combineEventsWithNamespace(['mousedown', 'touchstart'], eventNamespace);

    this.$().on(eventString, this._onPointerDown.bind(this));
  },

  willDestroyElement() {
    const eventNamespace = this.get('eventNamespace');

    this.$().off(eventNamespace);
  },

  _onPointerDown(event) {
    // Ignore everything except left-click dragging
    if (event.which !== 1) {
      return;
    }

    this.startX = getPointerX(event);
    this.startWidth = this.get('column.width');

    const ownerDocument = $(this.element.ownerDocument);
    const eventNamespace = this.get('eventNamespace');

    const moveEventString = combineEventsWithNamespace(['mousemove', 'touchmove'], eventNamespace);
    const upEventString = combineEventsWithNamespace(['mouseup', 'touchend'], eventNamespace);

    ownerDocument.on(moveEventString, this._onPointerMove.bind(this));
    ownerDocument.on(upEventString, this._onPointerUp.bind(this));
  },

  _onPointerMove(event) {
    const minWidth = this.get('column.minWidth');
    let diff = getPointerX(event) - this.startX;
    let newWidth = this.startWidth + diff;
    if (newWidth < minWidth) {
      newWidth = minWidth;
    }

    this.get('column').set('width', newWidth);
    this.attrs.onColumnWidthChange();
  },

  _onPointerUp(/* event */) {
    const ownerDocument = $(this.element.ownerDocument);
    const eventNamespace = this.get('eventNamespace');
    const events = ['mouseup', 'touchend', 'mousemove', 'touchmove'];

    ownerDocument.off(combineEventsWithNamespace(events, eventNamespace));
  }
});

function getPointerX(event) {
  if (event.type.indexOf('touch') === 0) {
    return (event.originalEvent.touches[0] || event.originalEvent.changedTouches[0]).pageX;
  }

  return event.pageX;
}

function combineEventsWithNamespace(events, namespace) {
  let eventString = events.join(`${namespace} `);
  return `${eventString}${namespace}`;
}
