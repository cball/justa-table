import Ember from 'ember';
import faker from 'faker';

export default Ember.Route.extend({
  model() {
    let users = [];
    for (let i = 0; i < 50; i++) {
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
  }
});
