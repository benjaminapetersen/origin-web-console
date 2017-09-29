'use strict';

const h = require('../helpers');
const Page = require('./page').Page;
const wait = require('../helpers/wait');
const scroller = require('../helpers/scroll');

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

    // SOMETHING IS WONKY HERE >>>>
    // SOMETHING IS WONKY HERE >>>>
    // SOMETHING IS WONKY HERE >>>>
    

    return scroller.toBottom().then(() => {
      let button = element(by.buttonText('Create'));
      return wait.forElem(button).then(() => {
        return button.click().then(() => {
          const OverviewPage = require('./overview').OverviewPage;
          return new OverviewPage(this.project);
        });
      });
    });
  }
}

exports.CreateFromTemplatePage = CreateFromTemplatePage;
