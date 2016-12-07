'use strict';

var _ = require('lodash');
var Page = require('./page').Page;

var RoutesPage = function(project) {
  this.project = project;
};

_.extend(RoutesPage.prototype, Page.prototype, {
  getUrl: function() {
    return 'project/' + this.project.name + '/browse/routes';
  }
});

exports.RoutesPage = RoutesPage;
