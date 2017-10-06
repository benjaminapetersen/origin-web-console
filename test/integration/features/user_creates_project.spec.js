'use strict';

const common = require('../helpers/common');
const timing = require('../helpers/timing');

const projectHelpers = require('../helpers/project');
const matchers = require('../helpers/matchers');

const CreateProjectPage = require('../page-objects/createProject').CreateProjectPage;
const OverviewPage = require('../page-objects/overview').OverviewPage;

const menus = require('../page-objects/menus').menus;

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

      // wait a bit to ensure project is created
      browser.sleep(timing.initialVisit);
      projectList.clickTileBy(project.displayName);

      // click through Application menu
      menus.leftNav.clickDeployments();
      matchers.expectPartialHeading('Deployments');
      menus.leftNav.clickStatefulSets();
      matchers.expectPartialHeading('Stateful Sets');
      menus.leftNav.clickPods();
      matchers.expectPartialHeading('Pods');
      menus.leftNav.clickServices();
      matchers.expectPartialHeading('Services');
      menus.leftNav.clickRoutes();
      matchers.expectPartialHeading('Routes');

      // click through Builds menu
      menus.leftNav.clickBuilds();
      matchers.expectPartialHeading('Builds');
      menus.leftNav.clickPipelines();
      matchers.expectPartialHeading('Pipelines');
      menus.leftNav.clickImages();
      matchers.expectPartialHeading('Image Streams');

      // click through Resources menu
      menus.leftNav.clickQuota();
      matchers.expectPartialHeading('Quota');
      menus.leftNav.clickMembership();
      matchers.expectPartialHeading('Membership');
      menus.leftNav.clickConfigMaps();
      matchers.expectPartialHeading('Config Maps');
      menus.leftNav.clickSecrets();
      matchers.expectPartialHeading('Secrets');
      menus.leftNav.clickOtherResources();
      matchers.expectPartialHeading('Other Resources');

      // click remaining primary sidebar items.
      menus.leftNav.clickOverview();
      let overviewPage = new OverviewPage(project);
      // overview doesn't show a heading, best check is url
      matchers.expectPageUrl(overviewPage.getUrl());
      menus.leftNav.clickStorage();
      matchers.expectPartialHeading('Storage');
      menus.leftNav.clickMonitoring();
      matchers.expectPartialHeading('Monitoring');


      // click through some top level menu items
      menus.topNav.clickCLI();
      matchers.expectPartialHeading('Command Line Tools');
      // we lose our nav on these pages.
      browser.navigate().back();
      browser.sleep(timing.navToPage);
      menus.topNav.clickAbout();
      matchers.expectPartialHeading('Red Hat Openshift');
      // Documentation link leaves console
      // Tour Home Page probably deserves it's own test,
      // perhaps in the catalog repo?
      // Copy Login should also just have its own test

    });
  });
});
