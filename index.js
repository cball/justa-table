/* jshint node: true */
'use strict';

var path = require('path');

module.exports = {
  name: 'justa-table',

  included: function(app) {
    this._super.included(app);

    app.import(path.join(app.bowerDirectory, 'jquery.floatThead/dist/jquery.floatThead.js'));
  }
};
