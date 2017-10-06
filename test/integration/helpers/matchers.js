'use strict';

exports.expectAlert = (msg) => {
  expect(element(by.css('.alert')).getText()).toEqual('error\n' + msg);
};

exports.expectHeading = (text, level) => {
  expect(element(by.css(level || '.middle h1')).getText()).toEqual(text);
};

// on some pages we hide help links within the heading.
// this makes it easier to ignore that text.
exports.expectPartialHeading = (partialText, caseSensitive, level) => {
  element(by.css(level || '.middle h1')).getText().then((text) => {
    let toMatch = caseSensitive ? partialText : partialText.toLowerCase();
    text = caseSensitive ? text : text.toLowerCase();
    expect(text).toContain(toMatch);
  });
};

exports.expectElementToExist = (elem) => {
  expect(elem.isPresent()).toBe(true);
};

exports.expectElementToBeVisible = (elem) => {
  expect(elem.isDisplayed()).toBeTruthy();
};

exports.expectElementToBeHidden = (elem) => {
  expect(elem.isDisplayed()).toBeFalsy();
};

exports.expectPageUrl = (pageUrl) => {
browser.getCurrentUrl().then((actualUrl) => {
  // NOTE: this uses contains instead of equals
  // to avoid worrying about query string inconsistencies, etc.
  // TODO: update w/flag to assert exact match?
  expect(actualUrl).toContain(pageUrl);
});
};
