'use strict';

const environment = require('../environment');
const nonAngular = require('../helpers/nonAngular').nonAngular;
const EC = protractor.ExpectedConditions;
// arbitrary page to visit
const projectHelpers = require('../helpers/project');
const CatalogPage = require('../page-objects/catalog').CatalogPage;

describe('unauthenticated user', () => {
  describe('attempts to login to the web console', () => {
    nonAngular(() => {
      browser.driver.get(environment.baseUrl);
      browser.driver.sleep(3000);
      browser.driver.wait(EC.presenceOf(element(by.name('username'))), 3000, 'Unable to find login form');

      browser.driver.findElement(by.name('username')).sendKeys('e2e-user');
      browser.driver.findElement(by.name('password')).sendKeys('e2e-user');
      browser.driver.findElement(by.css("button[type='submit']")).click();
      browser.driver.sleep(3000);

      let project = projectHelpers.projectDetails();
      let catalogPage = new CatalogPage(project);
      catalogPage.visit();
      browser.driver.sleep(10000);

    });
  });
});
