import Ember from 'ember';
import generateUsers from 'dummy/utils/generate-users';

const { Route } = Ember;

export default Route.extend({
  model() {
    return generateUsers(50);
  }
});
