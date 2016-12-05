'use strict';

exports.expectAlert = function(msg) {
  expect(element(by.css('.alert')).getText()).toEqual('error\n' + msg);
};
