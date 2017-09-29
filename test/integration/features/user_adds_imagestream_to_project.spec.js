'use strict';

const windowHelper = require('../helpers/window');
const projectHelpers = require('../helpers/project');
const CatalogPage = require('../page-objects/legacyCatalog').LegacyCatalogPage;
const CreateProjectPage = require('../page-objects/createProject').CreateProjectPage;
const ImageStreamsPage = require('../page-objects/imageStreams').ImageStreamsPage;
const LoginPage = require('../page-objects/login').LoginPage;

const centosImageStream = require('../fixtures/image-streams-centos7.json');

describe('User adds an image stream to a project', () => {

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
      it('should process and create the images in the image stream', () => {
        let project = projectHelpers.projectDetails();
        let createProjectPage = new CreateProjectPage(project);
        createProjectPage.visit();
        createProjectPage.createProject();
        let catalogPage = new CatalogPage(project);
        catalogPage.visit();
        catalogPage
          .processImageStream(JSON.stringify(centosImageStream))
          .then(() => {
            // verify we have the nodejs image stream loaded
            let imageStreamsPage = new ImageStreamsPage(project);
            imageStreamsPage.visit();
            expect(element(by.cssContainingText('td', 'nodejs')).isPresent()).toBe(true); // TODO: use fixture
          });
      });
    });
  });
});
