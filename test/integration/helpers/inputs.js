'use strict';

// is a pain to get an array of input values because .getAttribute()
// is a promise
// example:
//  getInputValues(element(by.css('input[type="text"]')))
//   .then(function(values) {  /* do stuff */  });
var getInputValues = function(inputs) {
  var allValues = protractor.promise.defer();
  var values = [];
  var count;
  inputs.count().then(function(num) {
    count = num;
  });
  inputs.each(function(input, i) {
    input.getAttribute('value').then(function(val) {
      values.push(val);
      if((i+1) === count) {
        allValues.fulfill(values);
      }
    });
  });
  return allValues.promise;
};


// inputs: protractor object
//  - element.all(by.model('parameter.value'))
// value: string
var findValueInInputs = function(inputs, value) {
  return getInputValues(inputs).then(function(values) {
    var found = values.find(function(val) {
      return val === value;
    });
    return found;
  });
};

// example:
//   check(element(by.css('input[type="checkbox"]')))
var check = function(checkboxElem) {
  return checkboxElem.isSelected().then(function(selected) {
    if(!selected) {
      return checkboxElem.click();
    }
  });
};

// example:
//   unCheck(element(by.css('input[type="checkbox"]')))
var uncheck = function(checkboxElem) {
  return checkboxElem.isSelected().then(function(selected) {
    if(selected) {
      return checkboxElem.click();
    }
  });
};

exports.getInputValues = getInputValues;
exports.findValueInInputs = findValueInInputs;

exports.check = check;
exports.uncheck = uncheck;
