'use strict';

const h = require('../helpers');
const logger = require('../helpers/logger');
const defaultMenus = require('./menus');

class Page {
  constructor(project, menus) {
    this.project = project;
    this.menus = menus || defaultMenus;
    // Whenever a page is created, we need to give
    // it some time to render
    browser.sleep(1000);
  }
  getUrl() {

  }
  // Visit should only be used as the initial entry point to
  // the app.  After that, tests should use page.menu.click()
  // to navigate.  Calling visit essentially performs a
  // browser refresh each time.
  visit() {
    logger.log('Visiting url (refresh):', this.getUrl());
    return h.goToPage(this.getUrl()).then(() => {
      // every revisit to a page should pause for rendering
      browser.sleep(1000);
    });
  }

}

exports.Page = Page;
