import Ember from 'ember';

const { inject } = Ember;

export default Ember.Route.extend({
  ajax: inject.service(),

  model() {
    return this.get('ajax').request('/docs/README.md', { dataType: 'text' });
  }
});
