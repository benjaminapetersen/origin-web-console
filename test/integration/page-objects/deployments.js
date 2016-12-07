'use strict';

var _ = require('lodash');
var Page = require('./page').Page;

var DeploymentsPage = function(project) {
  this.project = project;
};

_.extend(DeploymentsPage.prototype, Page.prototype, {
  getUrl: function() {
    return 'project/' + this.project.name + '/browse/deployments';
  }
});

exports.DeploymentsPage = DeploymentsPage;
