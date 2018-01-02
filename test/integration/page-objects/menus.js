'use strict';

const timing = require('../helpers/timing');
const logger = require('../helpers/logger');

let selectors = {
  topNav: '.dropdown-menu li a',
  // making child selectors explicit since we use the same class names for nested menus
  sidePrimary: 'sidebar .nav-vertical-primary > .list-group > .list-group-item',
  sideSecondary: 'sidebar .nav-pf-secondary-nav .list-group-item'
};



let clickNestedMenuItem = function(mainMenuSelector, childMenuSelector) {
  return element(mainMenuSelector).click().then(() => {
    return browser.sleep(timing.openMenu).then(() => {
      element(childMenuSelector).getText().then((txt) => {
        console.log('Clicking menu item: ', txt);
      });
      return element(childMenuSelector).click().then(() => {
        return browser.sleep(timing.navToPage);
      });
    });
  });
};

exports.menus = {
  clickLogo: () => {
    return element(by.id('openshift-logo')).click();
  },
  topNav: {
    // NOTE: this links out of the console
    clickDocumentation: () => {
      return clickNestedMenuItem(
              by.id('help-dropdown'),
              by.cssContainingText(selectors.topNav, 'Documentation'));
    },
    clickTourHomePage: () => {
      return clickNestedMenuItem(
              by.id('help-dropdown'),
              by.cssContainingText(selectors.topNav, 'Tour Home Page'));
    },
    // NOTE: navigates to a page w/o menus.
    clickCLI: () => {
      return clickNestedMenuItem(
              by.id('help-dropdown'),
              by.cssContainingText(selectors.topNav, 'Command Line Tools'));
    },
    clickAbout: () => {
      return clickNestedMenuItem(
              by.id('help-dropdown'),
              by.cssContainingText(selectors.topNav, 'About'));
    },

    clickCopyLogin: () => {
      return clickNestedMenuItem(
              by.id('user-dropdown'),
              by.cssContainingText(selectors.topNav, 'Copy Login Command'));
    },
    clickLogout: () => {
      return clickNestedMenuItem(
              by.id('user-dropdown'),
              by.cssContainingText(selectors.topNav, 'Log Out'));
    }
  },
  // example:
  //  AnyPage.leftNav.clickPods();
  leftNav: {
    clickOverview: () => {
      return element(by.cssContainingText(selectors.sidePrimary, 'Overview')).click();
    },
    // applications submenu
    clickDeployments: () => {
      return clickNestedMenuItem(
              by.cssContainingText(selectors.sidePrimary, 'Applications'),
              by.cssContainingText(selectors.sideSecondary, 'Deployments'));
    },
    clickStatefulSets: () => {
      return clickNestedMenuItem(
              by.cssContainingText(selectors.sidePrimary, 'Applications'),
              by.cssContainingText(selectors.sideSecondary, 'Stateful Sets'));
    },
    clickPods: () => {
      return clickNestedMenuItem(
              by.cssContainingText(selectors.sidePrimary, 'Applications'),
              by.cssContainingText(selectors.sideSecondary, 'Pods'));
    },
    clickServices: () => {
      return clickNestedMenuItem(
              by.cssContainingText(selectors.sidePrimary, 'Applications'),
              by.cssContainingText(selectors.sideSecondary, 'Services'));
    },
    clickRoutes: () => {
      return clickNestedMenuItem(
              by.cssContainingText(selectors.sidePrimary, 'Applications'),
              by.cssContainingText(selectors.sideSecondary, 'Routes'));
    },
    // builds submenu
    clickBuilds: () => {
      return clickNestedMenuItem(
              by.cssContainingText(selectors.sidePrimary, 'Builds'),
              by.cssContainingText(selectors.sideSecondary, 'Builds'));
    },
    clickPipelines: () => {
      return clickNestedMenuItem(
              by.cssContainingText(selectors.sidePrimary, 'Builds'),
              by.cssContainingText(selectors.sideSecondary, 'Pipelines'));
    },
    clickImages: () => {
      return clickNestedMenuItem(
              by.cssContainingText(selectors.sidePrimary, 'Builds'),
              by.cssContainingText(selectors.sideSecondary, 'Images'));
    },
    // resources submenu
    clickQuota: () => {
      return clickNestedMenuItem(
              by.cssContainingText(selectors.sidePrimary, 'Resources'),
              by.cssContainingText(selectors.sideSecondary, 'Quota'));
    },
    clickMembership: () => {
      return clickNestedMenuItem(
              by.cssContainingText(selectors.sidePrimary, 'Resources'),
              by.cssContainingText(selectors.sideSecondary, 'Membership'));
    },
    clickConfigMaps: () => {
      return clickNestedMenuItem(
              by.cssContainingText(selectors.sidePrimary, 'Resources'),
              by.cssContainingText(selectors.sideSecondary, 'Config Maps'));
    },
    clickSecrets: () => {
      return clickNestedMenuItem(
              by.cssContainingText(selectors.sidePrimary, 'Resources'),
              by.cssContainingText(selectors.sideSecondary, 'Secrets'));
    },
    clickOtherResources: () => {
      return clickNestedMenuItem(
              by.cssContainingText(selectors.sidePrimary, 'Resources'),
              by.cssContainingText(selectors.sideSecondary, 'Other Resources'));
    },
    // the rest of the top lvl menu items
    clickStorage: () => {
        return element(by.cssContainingText(selectors.sidePrimary, 'Storage')).click();
    },
    clickMonitoring: () => {
      return element(by.cssContainingText(selectors.sidePrimary, 'Monitoring')).click();
    }
  },
  // TODO: once we get a new CatalogPage, migrate this to
  // that page-object:
  clickViewAllProjects: () => {
    logger.log('menus:', 'clickViewAllProjects()');
    browser.sleep(timing.standardDelay);
    element(by.css('.projects-view-all')).click();
    browser.sleep(timing.standardDelay);
  },
  // ATM seems to be the most sensible place to put this, even
  // though it is not an actual menu item.
  backToPreviousPage: () => {
    browser.navigate().back();
    browser.sleep(timing.standardDelay);
  }
};
