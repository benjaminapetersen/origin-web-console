'use strict';

// NOTE: this could easily be abstracted into a generic event handler to be used
// by notifications, alert messages, etc.
angular
  .module('openshiftConsole')
  .service('notifications', function() {
    var channels = {
      all: []
    };

    var noSubscriber = function(channel, data) {
      Logger.log('No subscriber for', channel, data);
    };

    return {
      // subscribe to a specific channel:
      //   notifications.subscribe('foo/bar', function() { })
      // or all notifications:
      //   notifications.subscribe('all', function() { })
      //   notifications.subscribe(function() { })
      subscribe: function(channel, cb) {
        if(!cb && _.isFunction(channel)) {
          cb = channel;
          channel = 'all';
        }
        if(!channels[channel]) {
          channels[channel] = [];
        }
        var idx = (channels[channel].push(cb) -1);
        // returns a handler that can be handled either by/or:
        // handler.ubsubscribe();
        // notifications.unsubscribe(handler);
        return {
          id: idx,
          unsubscribe: function() {
            channels[channel].splice(idx, 1);
          }
        };
      },
      // to publish to a particular channel:
      //   publish('foo/bar', { foo: 'bar', baz: 'shizzle' })
      // handlers in the channels.all category will receive all notifications
      // for all channels.
      publish: function(channel, data) {
        if((!channels[channel] || !channels[channel].length)) {
          noSubscriber(channel, data);
        }
        _.each([].concat(channels[channel], channels.all), function(subscriber) {
          subscriber && subscriber(data);
        });
      },
      unsubscribe: function(handle) {
        handle && handle.unsubscribe && handle.unsubscribe();
      }
      // TODO: retrieve() fn && cache obj to pull notifications from a history?
    };
  });
