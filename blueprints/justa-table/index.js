/*jshint node:true*/

var VersionChecker = require('ember-cli-version-checker');

module.exports = {
  description: 'install justa-table into a project',

  normalizeEntityName: function() {},

  afterInstall: function() {
    const promises = [
      this.addBowerPackageToProject('jquery.floatThead', '^1.3.2')
    ];

    if (this._shouldInstallGetHelper()) {
      promises.push(this.addPackageToProject('ember-get-helper', '1.1.0'));
    }

    return Promise.all(promises);
  },

  _shouldInstallGetHelper() {
    const checker = new VersionChecker(this);

    return checker.for('ember', 'bower').satisfies('< 2.0.0');
  }
};
