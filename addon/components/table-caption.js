import Ember from 'ember';
import layout from '../templates/components/table-caption';

const { Component, computed } = Ember;

export default Component.extend({
  layout,
  tagName: 'caption',
  classNameBindings: ['alignmentClass', 'hideFromView:visually-hidden'],

  caption: null,
  alignment: null,
  hiddenFromView: false,

  alignmentClass: computed('alignment', {
    get() {
      const alignment = (this.get('alignment') || 'center').toLowerCase();

      return {
        left: 'align-left',
        center: 'align-center',
        right: 'align-right'
      }[alignment];
    }
  })
});
