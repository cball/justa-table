import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('examples', function() {
    this.route('basic-table');
    this.route('fixed-column-table');
    this.route('resizable-columns-table');
    this.route('infinite-loader-table');
    this.route('collapsable-table');
    this.route('collapsable-table-with-ajax');
    this.route('group-by-name');
    this.route('sticky-headers');
    this.route('hide-offscreen');
  });
});

export default Router;
