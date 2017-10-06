'use strict';

const forms = require('../helpers/forms');
const timing = require('../helpers/timing');
const Page = require('./page').Page;
const ProjectList = require('./projectList').ProjectList;

class CreateProjectPage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }

  getUrl() {
    return 'create-project';
  }

  // TODO: there is an implicit navigation here, this should return a new Overview page for clarity
  createProject() {
    return forms.submitNewProjectForm(this.project).then(() => {
      return new ProjectList();
    });
  }
}

exports.CreateProjectPage = CreateProjectPage;
