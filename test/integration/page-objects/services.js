'use strict';

var _ = require('lodash');
var Page = require('./page').Page;

var ServicesPage = function(project) {
  this.project = project;
};

_.extend(ServicesPage.prototype, Page.prototype, {
  getUrl: function() {
    return 'project/' + this.project.name + '/browse/services';
  }
});

exports.ServicesPage = ServicesPage;
