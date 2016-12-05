'use strict';

require('jasmine-beforeall');
var h = require('../helpers.js');
var projectHelpers = require('../helpers/project.js');
var inputsHelpers = require('../helpers/inputs.js');
var createFromURLPage = require('./createFromURL.js');
var expectHeading = require('../matchers/expectHeading.js').expectHeading;
var expectAlert = require('../matchers/expectAlert.js').expectAlert;


describe('authenticated e2e-user', function() {

  var project = projectHelpers.projectDetails();

  beforeAll(function() {
    h.commonSetup();
    h.login();
  });

  afterAll(function() {
    h.afterAllTeardown();
  });

  describe('create from URL', function() {

    describe('using an image stream and image stream tag supplied as query string params', function() {

      // because projectHelpers.deleteAllProjects(); at the end of each it() results in error
      afterEach(function(){
        projectHelpers.deleteAllProjects();
      });

      var app = 'nodejs-edited';
      var sourceURI = 'https://github.com/openshift/nodejs-ex.git-edited';
      var sourceRef = 'master-edited';
      var contextDir = '/-edited';
      var qs = '?imageStream=nodejs&imageTag=4&app=' + app + '&sourceURI=' + sourceURI + '&sourceRef=' + sourceRef + '&contextDir=' + contextDir;
      var uri = 'project/' + project.name + 'create/fromimage' + qs;
      var heading = 'Node.js 4';
      var words = project.name.split(' ');
      var timestamp = words[words.length - 1];

      it('should display details about the the image', function() {
        createFromURLPage.visit(qs);
        expectHeading(heading);
      });

      it('should load the image stream in to a newly created project', function(){
        createFromURLPage.visit(qs);
        // NOTE: if the tabs are on the page because there are existing projects, click the 'Create New Project' tab first
        createFromURLPage.clickCreateNewProjectTab();
        projectHelpers.createProject(project, 'project/' + project['name'] + 'create/fromimage' + qs);
        expectHeading(heading);
      });

      it('should load the image stream in to an existing project and verify the query string params are loaded in to the corresponding form fields', function(){
        projectHelpers.visitCreatePage();
        projectHelpers.createProject(project);
        createFromURLPage.visit(qs);
        createFromURLPage.selectExistingProject(timestamp, uri);
        expectHeading(heading);
        var appInput = element(by.model('name'));
        expect(appInput.getAttribute('value')).toEqual(app);
        var sourceURIInput = element(by.model('buildConfig.sourceUrl'));
        expect(sourceURIInput.getAttribute('value')).toEqual(sourceURI);
        // click "Show advanced..." link to reveal hidden fields
        element(by.css('[ng-click="advancedOptions = !advancedOptions"]')).click();
        var sourceRefInput = element(by.model('buildConfig.gitRef'));
        expect(sourceRefInput.getAttribute('value')).toEqual(sourceRef);
        var contextDirInput = element(by.model('buildConfig.contextDir'));
        expect(contextDirInput.getAttribute('value')).toEqual(contextDir);
      });

    });

    describe('using a template supplied as a query string param', function() {

      // because projectHelpers.deleteAllProjects(); at the end of each it() results in error
      afterEach(function(){
        projectHelpers.deleteAllProjects();
      });

      var sourceURL = "https://github.com/openshift/nodejs-ex.git-edited";
      var qs = '?template=nodejs-mongodb-example&templateParamsMap=%7B"SOURCE_REPOSITORY_URL":"' + sourceURL + '"%7D';
      var uri = 'project/' + project.name + 'create/fromtemplate' + qs;
      var heading = 'Node.js + MongoDB (Ephemeral)';
      var words = project.name.split(' ');
      var timestamp = words[words.length - 1];

      it('should display details about the template', function() {
        createFromURLPage.visit(qs);
        expectHeading(heading);
      });

      it('should load the template in to a newly created project', function() {
        createFromURLPage.visit(qs);
        // NOTE: if the tabs are on the page because there are existing projects, click the 'Create New Project' tab first
        createFromURLPage.clickCreateNewProjectTab();
        projectHelpers.createProject(project, 'project/' + project['name'] + 'create/fromtemplate' + qs);
        expectHeading(heading);
      });

      it('should load the template in an existing project and verify the query string param sourceURL is loaded in to a corresponding form field', function(){
        projectHelpers.visitCreatePage();
        projectHelpers.createProject(project);
        createFromURLPage.visit(qs);
        createFromURLPage.selectExistingProject(timestamp, uri);
        expectHeading(heading);
        inputsHelpers
          .findValueInInputs(element.all(by.model('parameter.value')), sourceURL)
          .then(function(found) {
            expect(found).toEqual(sourceURL);
          });
        });
    });

    describe('using a namespace that is not in the whitelist', function() {
      it('should display an error about the namespace', function() {
        createFromURLPage.visit('?namespace=not-whitelisted');
        expectAlert('Resources from the namespace "not-whitelisted" are not permitted.');
      });
    });

    describe('using an unavailable image stream supplied as a query string param', function() {
      it('should display an error about the image stream', function() {
        createFromURLPage.visit('?imageStream=unavailable-imageStream');
        expectAlert('The requested image stream "unavailable-imageStream" could not be loaded.');
      });
    });

    describe('using an unavailable image tag supplied as a query string param', function() {
      it('should display an error about the image tag', function() {
        createFromURLPage.visit('?imageStream=nodejs&imageTag=unavailable-imageTag');
        expectAlert('The requested image stream tag "unavailable-imageTag" could not be loaded.');
      });
    });

    describe('using an unavailable template supplied as a query string param', function() {
      it('should display an error about the template', function() {
        createFromURLPage.visit('?template=unavailable-template');
        expectAlert('The requested template "unavailable-template" could not be loaded.');
      });
    });

    describe('without using an image stream or a template', function() {
      it('should display an error about needing a resource', function() {
        createFromURLPage.visit('');
        expectAlert('An image stream or template is required.');
      });
    });
    describe('using both an image stream and a template', function() {
      it('should display an error about combining resources', function() {
        createFromURLPage.visit('?imageStream=nodejs&template=nodejs-mongodb-example');
        expectAlert('Image streams and templates cannot be combined.');
      });
    });
    describe('using an invalid app name as a query string param', function() {
      it('should display an error about the app name', function() {
        createFromURLPage.visit('?app=InvalidAppName&template=nodejs-mongodb-example');
        expectAlert('The app name "InvalidAppName" is not valid. An app name is an alphanumeric (a-z, and 0-9) string with a maximum length of 24 characters, where the first character is a letter (a-z), and the \'-\' character is allowed anywhere except the first or last character.');
      });
    });

  });

});
