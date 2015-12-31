import Ember from 'ember';
import layout from '../templates/components/in-viewport-checker';
import InViewportMixin from 'ember-in-viewport';

const {
  Component,
  setProperties,
  on
} = Ember;

export default Component.extend(InViewportMixin, {
  layout,
  viewportTopOffset: 500,

  viewportOptionsOverride: on('didInsertElement', function() {
    setProperties(this, {
      viewportSpy: true,
      viewportTolerance: {
        top: this.get('viewportTopOffset')
      }
    });
  }),

  didEnterViewport() {
    let enterViewportAction = this.attrs['on-enter-viewport']();

    if (enterViewportAction === false) {
      this.destroy();
    }
  }
});
