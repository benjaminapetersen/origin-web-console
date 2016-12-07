'use strict';

var h = require('../helpers');
var scroll = require('../helpers/scroll');
var _ = require('lodash');
var Page = require('./page').Page;
//var logger = require('../helpers/logger');

var CreateFromTemplatePage = function(project, template) {
  this.project = project;
  this.template = template;
};

_.extend(CreateFromTemplatePage.prototype, Page.prototype, {
  getUrl: function() {
    var url = 'project/' + this.project.name + '/create/fromtemplate';
    if(this.template) {
      url += '?template='+this.template.name; //+'&namespace='; may need template namespace...
    }
    return url;
  },
  clickCreate: function() {
    scroll.toBottom();
    var button = element(by.buttonText('Create'));
    h.waitForElem(button);
    return button.click().then(function() {
      return new require('./overview').OverviewPage(this.project);
    }.bind(this));
  }
});

exports.CreateFromTemplatePage = CreateFromTemplatePage;
