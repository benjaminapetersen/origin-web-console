'use strict';

const Page = require('./Page').Page

class NextStepsPage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  // NOTE: this page will typically be visited implicitly
  // as the result of a redirect.  The is state stored in
  // the query string, for example:
  // ?name=Node.js%20%2B%20MongoDB%20(Ephemeral)
  getUrl() {
    return 'project/' + this.project.name + '/create/next';
  }
}

exports.NextStepsPage = NextStepsPage;
