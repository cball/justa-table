import Ember from 'ember';
import layout from '../templates/components/yes-no-table-cell';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'td',
  classNames: ['yes-no-cell'],

  /**
    Boolean that is used to determine "yes", "no" or "not specified" content.

    Also supports an object for backwards compatibility, but this is deprecated.
  */
  value: undefined,
  yesNoProperty: 'value',

  /**
    Return true if this should be a yes cell.

    To remain backwards compatible with current APIs, check for a boolean value
    before falling back to an isYes property.

    When API is updated, use: Ember.computed.eq
  */
  isYes: Ember.computed('value', function() {
    let value = this.getWithDefault('value', {});
    let yesNoProperty = this.get('yesNoProperty');

    if (typeof value === 'boolean') {
      return value === true;
    } else {
      return value[yesNoProperty];
    }
  }),

  /**
    Return true if this should be a no cell.

    To remain backwards compatible with current APIs, check for a boolean value
    before falling back to an isNo property.

    When API is updated, use: Ember.computed.eq
  */
  isNo: Ember.computed('value', function() {
    let value = this.getWithDefault('value', {});
    let yesNoProperty = this.get('yesNoProperty');

    if (typeof value === 'boolean') {
      return value === false;
    } else {
      return value[yesNoProperty];
    }
  }),

  isNotSelected: Ember.computed.empty('value')
});
