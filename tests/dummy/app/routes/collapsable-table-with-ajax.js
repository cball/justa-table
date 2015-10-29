import Ember from 'ember';

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
