'use strict';

const windowHelper = require('../helpers/window');
const projectHelpers = require('../helpers/project');
const matchers = require('../helpers/matchers');

const LoginPage = require('../page-objects/login').LoginPage;
const CreateProjectPage = require('../page-objects/createProject').CreateProjectPage;

describe('Authenticated user creates a new project', () => {
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

  it('should be able to create a new project', () => {
    let project = projectHelpers.projectDetails();
    let createProjectPage = new CreateProjectPage(project);
    createProjectPage.visit();
    let projectList = createProjectPage.createProject();
    matchers.expectElementToBeVisible(projectList.findTileBy(project.displayName));
    browser.pause();
  });

  // it('should be able to browse builds', () => {
  //
  // });
  //
  // it('should be able to browse deployments', () => {
  //
  // });
  //
  // it('should be able to browse events', () => {
  //
  // });
  //
  // it('should be able to browse image streams', () => {
  //
  // });
  //
  // it('should be able to browse pods', () => {
  //
  // });
  //
  // it('should be able to browse services', () => {
  //
  // });
  //
  // it('should validate name taken when trying to create a project with an existing name', () => {
  //
  // });
  //
  // it('should be able to delete a project', () => {
  //
  // });
});
