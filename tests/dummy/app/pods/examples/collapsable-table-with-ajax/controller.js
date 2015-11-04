import Ember from 'ember';
import faker from 'faker';

let fakeUsers = function(number=10) {
  let users = [];

  for (let i = 0; i < number; i++) {
    let user = Ember.Object.create({
      displayName: faker.name.findName(),
      address: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zipCode: faker.address.zipCode(),
      flagged: faker.random.boolean(),
      company: faker.company.companyName()
    });

    users.push(user);
  }

  return users;
};

export default Ember.Controller.extend({
  actions: {
    onRowExpand(/*rowGroup*/) {
      let promise = new Ember.RSVP.Promise((resolve) => {
        Ember.run.later(this, function() {
          resolve(fakeUsers(10));
        }, 2000);
      });

      return promise;
    }
  }
});
