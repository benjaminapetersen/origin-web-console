'use strict';

const Page = require('./Page').Page;

class ProjectList extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  // NOTE: this page will typically be visited implicitly
  // as the result of a redirect.  The is state stored in
  // the query string, for example:
  // ?name=Node.js%20%2B%20MongoDB%20(Ephemeral)
  getUrl() {
    return 'projects';
  }
  findProjectTiles() {
    return element.all(by.css('.list-group-item'));
  }
  findTileBy(projectName) {
    return element(by.cssContainingText(projectName));
  }
}

exports.ProjectList = ProjectList;
