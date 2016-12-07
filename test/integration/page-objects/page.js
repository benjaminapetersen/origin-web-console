'use strict';

var _ = require('lodash');
var h = require('../helpers');
var logger = require('../helpers/logger');

var Page = function(project) {
  this.project = project;
};

var clickNestedMenuItem = function(mainMenuSelector, childMenuSelector) {
  return element(mainMenuSelector).click().then(function() {
    return browser.sleep(300).then(function() {
      return element(childMenuSelector).click();
    });
  });
};

_.extend(Page.prototype, {
  // individual pages should override the .getUrl function to return an appropriate path.
  getUrl: function() {},
  // FooPage.visit() is the preferred way to navigate to any page,
  // which will work so long as it overrides .getUrl();
  visit: function() {
    logger.log('visiting url:',this.getUrl());
    return h.goToPage(this.getUrl());
  },
  // TODO: decide if these should be kept for testing purposes, or removed.
  // Page.topMenu & Page.sideMenu provide navigation via clicking the menu.
  // HOWEVER, prefer the use of individual .visit() methods on pages.
  // example:
  //   var foo = new FooPage(project);
  //   foo.visit();
  topMenu: {
    clickDocumentation: function() {
      return clickNestedMenuItem(by.id('help-dropdown'), by.cssContainingText('.dropdown.open', 'Documentation'));
    },
    clickCLI: function() {
      return clickNestedMenuItem(by.id('help-dropdown'), by.css('.dropdown.open', 'Command Line Tools'));
    },
    clickAbout: function() {
      return clickNestedMenuItem(by.id('help-dropdown'), by.css('.dropdown.open', 'About'));
    },
    clickLogout: function() {
      return clickNestedMenuItem(by.id('iser-dropdown'), by.css('.dropdown.open', 'Logout'));
    }
  },
  // example:
  //  AnyPage.sideMenu.clickPods();
  sideMenu: {
    clickOverview: function() {
      return element(by.cssContainingText('.dropdown-toggle', 'Overview').row(0)).click();
    },
    // applications submenu
    clickDeployments: function() {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Applications'), by.cssContainingText('a', 'Deployments'));
    },
    clickPods: function() {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Applications'), by.cssContainingText('a', 'Pods'));
    },
    clickServices: function() {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Applications'), by.cssContainingText('a', 'Services'));
    },
    clickRoutes: function() {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Applications'), by.cssContainingText('a', 'Routes'));
    },
    // builds submenu
    clickBuilds: function() {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Builds'), by.cssContainingText('a', 'Builds'));
    },
    clickPipelines: function() {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Builds'), by.cssContainingText('a', 'Pipelines'));
    },
    clickImages: function() {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Builds'), by.cssContainingText('a', 'Images'));
    },
    // resources submenu
    clickQuota: function() {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Resources'), by.cssContainingText('a', 'Quota'));
    },
    clickMembership: function() {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Resources'), by.cssContainingText('a', 'Membership'));
    },
    clickConfigMaps: function() {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Resources'), by.cssContainingText('a', 'Config Maps'));
    },
    clickSecrets: function() {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Resources'), by.cssContainingText('a', 'Secrets'));
    },
    clickOtherResources: function() {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Resources'), by.cssContainingText('a', 'Other Resources'));
    },
    // rest
    clickStorage: function() {
      return element(by.cssContainingText('a', 'Storage')).click();
    },
    clickMonitoring: function() {
      return element(by.cssContainingText('a', 'MOnitoring')).click();
    }
  }
});


exports.Page = Page;
