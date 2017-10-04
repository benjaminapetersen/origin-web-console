'use strict';

const common = require('../helpers/common');
const projectHelpers = require('../helpers/project');
const matchers = require('../helpers/matchers');

const CreateProjectPage = require('../page-objects/createProject').CreateProjectPage;
// const OverviewPage = require('../page-objects/overviewPage').OverviewPage;

describe('Authenticated user creates a new project', () => {

  beforeEach(() => {
    common.beforeEach();
  });

  afterEach(() => {
    common.afterEach();
  });

  it('should be able to create a new project', () => {
    let project = projectHelpers.projectDetails();
    let createProjectPage = new CreateProjectPage(project);
    createProjectPage.visit();
    createProjectPage.createProject().then((projectList) => {
      // show the project in the list
      matchers.expectElementToBeVisible(projectList.findTileBy(project.displayName));

      // navigate to Overview
      // projectList.clickTileBy(project.displayName);
      // let overviewPage = new OverviewPage(project);

      // click add to project

      // do the rest of the things....
    });
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
