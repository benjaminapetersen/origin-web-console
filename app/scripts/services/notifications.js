'use strict';

angular
  .module('openshiftConsole')
  .factory('notifications',
    function($rootScope, $routeParams, DataService) {
      var cache;
      var cacheKey = 'notifications';
      var storageType = 'sessionStorage';
      var watches = [];
      var load = function() {
        return JSON.parse(window[storageType].getItem(cacheKey) || '{}');
      };
      // TODO: whenver a user takes an action, we need to save the cache
      var save = function(data) {
        window[storageType].setItem(cacheKey, JSON.stringify(data));
      };
      // groups is a long running object to avoid flickering UI.
      var groups = {};
      var processEvents = function(data) {
        // count: Object.keys(data.by('metadata.name')).length
        // messages: _.map(data.by('metadata.name'), 'message')
        _.each(data.by('metadata.name'), function(event) {
          groups[event.involvedObject.name] = groups[event.involvedObject.name] || {
            heading: event.involvedObject.name,
            subheading: event.involvedObject.kind,
            notifications: {}
          };
          groups[event.involvedObject.name].notifications[event.metadata.uid] = {
            unread:  !_.get(cache, [event.metadata.namespace, event.metadata.uid, 'read']),
            message: event.message,
            lastTimestamp: event.lastTimestamp, // moment(event.lastTimestamp).format('LLL') -> March 6, 2017 3:15 PM
            metadata: event.metadata,
            status: 'info',
            timestamp: null,
            actions: null
          };
        });
        return _.map(groups, function(group) {
          group.notifications = _.map(group.notifications, function(notification) {
            return notification;
          });
          return group;
        });
      };

      cache = load();


      return {
        // subscribe to notifications for a given project
        // will setup DataService.watch('events') for that project,
        // process any cached data we have against the events being
        // watched, & call the callback function.
        subscribe: function(projName, fn) {
          watches.push(DataService.watch('events', {namespace: projName}, function(data) {
            // TODO: process events using the cache & return.
            // perhaps we have to use a single object & share it, as the source
            // of truth, so the UI doesn't flicker.  :/
            // fn(process(events, cache[projectName]));
            fn(processEvents(data));
          }));
        },
        // do we need to have a publish?
        publish: function() {
          console.log('publish', arguments);
        },
        // TODO:
        // to cleanup.
        // currently calling this cleans up all the watches.  this is not ideal.
        // each controller/directive needs to be able to handle its own destiny.
        // perhaps we simply return the key to the controller.
        unsubscribe: function() {
          DataService.unwatch(watches);
        },
        markUnread: function(notification) {
          notification.unread = false;
          _.set(cache, [notification.metadata.namespace, notification.metadata.uid], {
            read: true,
            timestamp: Date.now() // TODO: in case we need to flush this cache...
          });
          save(cache);
        }
      };
    });


//
// link: function() {
//   notifications.subscribe(function(groupedEvents) {
//
//   });
//   notifications.unsubscribe();
// }
