import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('basic-table');
  this.route('fixed-column-table');
  this.route('infinite-loader-table');
  this.route('collapsable-table');
  this.route('collapsable-table-with-ajax');
});

export default Router;
