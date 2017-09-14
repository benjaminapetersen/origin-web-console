'use strict';

var EC = protractor.ExpectedConditions;
var timing = require('./timing');

exports.forElem = (elem) => {
  return browser.wait(EC.presenceOf(elem), timing.maxWaitForElement, 'Element taking too long to appear in the DOM.');
};

exports.forClickableElem = (elem) => {
  return browser.wait(EC.elementToBeClickable(elem), timing.maxWaitForElement, 'Element taking too long to become clickable.');
};
