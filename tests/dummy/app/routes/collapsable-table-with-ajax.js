import Ember from 'ember';
import faker from 'faker';

export default Ember.Route.extend({
  model() {
    return [
      {
        label: 'Happy Users',
        isCollapsed: true,
        data: []
      },
      {
        label: 'Crazy Users',
        isCollapsed: true,
        data: []
      },
      {
        label: 'Super Users',
        isCollapsed: true,
        data: []
      }
    ];
  },

  actions: {
    fetchGroupData(group) {
      let promise = new Ember.RSVP.Promise((resolve) => {
        Ember.run.later(this, function() {
          resolve(fakeUsers(10));
        }, 2000);
      });

      return promise();
    },

    toggleExpandAll() {
      const model = Ember.A(this.get('controller.model'));
      // model.forEach((m) => {
      //   this.get('controller').actions.toggleRowCollapse(m);
      // });
      const anyExpanded = model.isEvery('isCollapsed', false);

      if (anyExpanded) {
        model.setEach('isCollapsed', true);
      } else {
        model.setEach('isCollapsed', false);
      }
    }
  }
});
