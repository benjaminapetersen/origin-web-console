'use strict';

const winHelper = require('../helpers/window');
const Page = require('./page').Page;
const EC = protractor.ExpectedConditions;

class CreateFromTemplatePage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  getUrl() {
    let url = 'project/' + this.project.name + '/create/fromtemplate';
    if(this.template) {
      url += '?template='+this.template.name; //+'&namespace='; may need template namespace...
    }
    return url;
  }
  clickCreate() {
    let button = element(by.buttonText('Create'));
    winHelper.scrollToElement(button);
    browser.wait(EC.elementToBeClickable(button), 15000, 'Create button is not clickable');
    return button.click().then(() => {
      // hiding a delay in here since the action will cause the server
      // to create resources & any actions following clickCreate() will
      // likely expect DOM nodes to exist (that will not until these
      // resources are generated)
      return browser.sleep(500).then(() => {
        // implicit redirect
        const NextStepsPage = require('./nextSteps').NextStepsPage;
        return new NextStepsPage(this.project);
      });
    });
  }
}

exports.CreateFromTemplatePage = CreateFromTemplatePage;
