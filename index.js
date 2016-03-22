/* jshint node: true */
'use strict';

module.exports = {
  name: 'justa-table',
  included: function(app) {
    this._super.included(app);

    app.import('bower_components/jquery.floatThead/dist/jquery.floatThead.js');
  }
};
