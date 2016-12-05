'use strict';

exports.expectHeading = function(heading) {
  expect(element(by.css('h1')).getText()).toEqual(heading);
};
