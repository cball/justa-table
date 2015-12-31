import Ember from 'ember';
import faker from 'faker';

export default function generateUsers(number=50) {
  let users = [];
  for (let i = 0; i < number; i++) {
    let user = Ember.Object.create({
      displayName: faker.name.findName(),
      image: faker.image.avatar(),
      one: faker.company.catchPhrase(),
      two: faker.company.bsBuzz()
    });

    users.push(user);
  }

  return users;
}
