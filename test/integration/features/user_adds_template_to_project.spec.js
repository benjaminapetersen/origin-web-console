'use strict';

const logger = require('../helpers/logger');
const windowHelper = require('../helpers/window');
const projectHelpers = require('../helpers/project');
const CatalogPage = require('../page-objects/legacyCatalog').LegacyCatalogPage;
const CreateProjectPage = require('../page-objects/createProject').CreateProjectPage;
const DeploymentsPage = require('../page-objects/deployments').DeploymentsPage;
const ServicesPage = require('../page-objects/services').ServicesPage;
const RoutesPage = require('../page-objects/routes').RoutesPage;
const LoginPage = require('../page-objects/login').LoginPage;

const nodeMongoTemplate = require('../fixtures/nodejs-mongodb');

describe('User adds a template to a project', () => {

  beforeEach(() => {
    windowHelper.setSize();
    let loginPage = new LoginPage();
    loginPage.login();
    browser.driver.sleep(1000);
    projectHelpers.deleteAllProjects();
  });

  afterEach(() => {
    windowHelper.clearStorage();
  });

  describe('after creating a new project', () => {
    describe('using the Import YAML tab', () => {
      it('should process and create the objects in the template', () => {
        let project = projectHelpers.projectDetails();
        let createProjectPage = new CreateProjectPage(project);
        createProjectPage.visit();
        createProjectPage.createProject();
        let catalogPage = new CatalogPage(project);
        catalogPage.visit();
        catalogPage
          .processTemplate(JSON.stringify(nodeMongoTemplate))
          .then((createFromTemplatePage) => {
            // implicit redirect to overview page
            createFromTemplatePage.clickCreate();

            // verify we have the 2 deployments in the template
            let deploymentsPage = new DeploymentsPage(project);
            deploymentsPage.visit();
            expect(element(by.cssContainingText('td a', 'mongodb')).isPresent()).toBe(true); // TODO: use fixture
            expect(element(by.cssContainingText('td a', 'nodejs-mongodb-example')).isPresent()).toBe(true); // TODO: use fixture
            // verify we have the two services in the template
            let servicesPage = new ServicesPage(project);
            servicesPage.visit();
            expect(element(by.cssContainingText('td a', 'mongodb')).isPresent()).toBe(true); // TODO: use fixture
            expect(element(by.cssContainingText('td a', 'nodejs-mongodb-example')).isPresent()).toBe(true); // TODO: use fixture
            // verify we have one route for the mongo app
            let routesPage = new RoutesPage(project);
            routesPage.visit();
            expect(element(by.cssContainingText('td a', 'nodejs-mongodb-example')).isPresent()).toBe(true); // TODO: use fixture
          });
      });

      it('should save the template in the project catalog', () => {
        // TODO: same flow as the above test, but use:
        //    catalogPage.saveTemplate(tpl)
        // & assert that the template was added to the catalog in this project
        let project = projectHelpers.projectDetails();
        let createProjectPage = new CreateProjectPage(project);
        createProjectPage.visit();
        createProjectPage.createProject();
        let catalogPage = new CatalogPage(project);
        catalogPage.visit();
        catalogPage
          .saveTemplate(JSON.stringify(nodeMongoTemplate))
          .then(() => {
            // once the template processes, we just have to return
            // to the catalog and verify the tile exists
            catalogPage.visit();
            catalogPage.clickCategory('JavaScript'); // TODO: pass in the tile name from the template fixture
            catalogPage.findTileBy('Node.js + MongoDB (Ephemeral)', project.name); // TODO: pass in...
            expect(element).toBeTruthy();
          });
      });
    });
  });
});
