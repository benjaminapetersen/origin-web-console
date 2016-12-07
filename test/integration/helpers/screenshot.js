'use strict';

var fs = require('fs');

exports.take = function(savePath) {
  return browser.takeScreenshot().then(function(png) {
    var stream = fs.createWriteStream(savePath || '/tmp/origin-web-console-e2e-screenshot.png');
    stream.write(new Buffer(png, 'base64'));
    stream.end();
  });
};
