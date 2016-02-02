import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return [
      {
        director: 'Quentin Tarantino',
        movie: 'Pulp Fiction'
      },
      {
        director: 'Quentin Tarantino',
        movie: 'Reservoir Dogs'
      },
      {
        director: 'JJ Abrams',
        movie: 'Star Wars Episode VII'
      },
      {
        director: 'Christopher Nolan',
        movie: 'Dark Knight Rises'
      },
      {
        director: 'Christopher Nolan',
        movie: 'Interstellar'
      }
    ];
  }
});
