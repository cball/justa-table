import Ember from 'ember';
import generateUsers from 'dummy/utils/generate-users';

const {
  A,
  Controller,
  computed
} = Ember;

export default Controller.extend({
  page: 1,
  perPage: 10,

  // normally this would come from metadata
  totalPages: 5,
  onLastPage: computed('totalPages', 'page', function() {
    return this.get('totalPages') === this.get('page');
  }),

  actions: {
    loadMoreUsers() {
      if (this.get('onLastPage')) {
        return false;
      }
      let newUsers = generateUsers(10);
      let currentPage = this.get('page');
      let users = new A(this.get('model'));

      users.pushObjects(newUsers);
      this.set('page', currentPage + 1);
    }
  }
});
