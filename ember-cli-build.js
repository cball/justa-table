/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    babel: {
      includePolyfill: true
    }
  });

  /*
    This build file specifes the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  var funnel = require('broccoli-funnel');
  var UnwatchedDir  = require('broccoli-source').UnwatchedDir;

  app.import(app.bowerDirectory + '/bootstrap-sass/assets/javascripts/bootstrap.js');
  app.import(app.bowerDirectory + '/StickyTableHeaders/js/jquery.stickytableheaders.min.js');

  var bootstrapFonts = funnel(app.bowerDirectory + '/bootstrap-sass/assets/fonts/bootstrap', {
    destDir: '/assets/bootstrap'
  });

  var readmeDoc = funnel(new UnwatchedDir(app.project.root), {
    files: ['README.md'],
    destDir: '/docs'
  });

  return app.toTree([bootstrapFonts, readmeDoc]);
};
