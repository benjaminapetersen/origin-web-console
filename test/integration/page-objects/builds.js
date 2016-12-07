'use strict';

var _ = require('lodash');var Page = require('./page').Page;

var BuildsPage = function(project) {
  this.project = project;
};

_.extend(BuildsPage.prototype, Page.prototype, {
  getUrl: function() {
    return 'project/' + this.project.name + '/browse/builds';
  }
});

exports.BuildsPage = BuildsPage;
