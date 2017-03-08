'use strict';

var EC = protractor.ExpectedConditions;

// elem is a single protractor ElementFinder, such as: `element(by.css('.foo'))`
// not an ElementArrayFinder, this will not work: `element.all(by.css('.foo'))`
// example:
//  waitForElement(element(by.css('.foo')));  // success
//  waitForElement(element.all(by.css('.foos')));  // fail, incorrect element.all
var waitForElem = function(elem, timeout) {
  return browser.wait(EC.presenceOf(elem), timeout || 5000, 'Element not found: ' + elem.locator().toString());
};
exports.waitForElem = waitForElem;

var waitForElemRemoval = function(elem, timeout) {
  return browser.wait(EC.not(EC.presenceOf(elem)), timeout || 5000, 'Element did not disappear');
};
exports.waitForElemRemoval = waitForElemRemoval;

// an alt to waitForElem()
// waitForElem() does not use protractor.ExpectConditions, which can occasionally flake
exports.waitForPresence = function(selector, elementText, timeout, callback) {
  if (!timeout) { timeout = 5000; }
  var el;
  if (elementText) {
    el = element(by.cssContainingText(selector, elementText));
  }
  else {
    el = element(by.css(selector));
  }
  browser
    .wait(EC.presenceOf(el), timeout, "Element not found: " + selector)
    .then(function() {
      if(callback) {
        callback();
      }
    });
};


exports.presenceOf = function(obj) {
  return EC.presenceOf(obj);
};

// example:
//  h.waitFor(h.presenceOf(page.header()))
exports.waitFor = function(item, timeout, msg) {
  timeout = timeout || 5000;
  msg = msg || '';
  return browser.wait(item, timeout, msg);
};
