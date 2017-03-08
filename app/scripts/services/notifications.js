'use strict';

angular
  .module('openshiftConsole')
  .factory('notifications',
    function($rootScope, $routeParams, DataService) {
      var cache;
      var cacheKey = 'notifications';
      var storageType = 'sessionStorage';
      var load = function() {
        return JSON.parse(window[storageType].getItem(cacheKey) || '{}');
      };
      var save = function(data) {
        window[storageType].setItem(cacheKey, JSON.stringify(data));
      };
      var groups = {};
      var processEvents = function(data) {
        _.each(data.by('metadata.name'), function(event) {
          var namespace = event.involvedObject.namespace;
          var name = event.involvedObject.name;
          var uid = event.metadata.uid;
          // TODO: filtering options:
          // - event.type: Normal, Warning, etc.
          // - event.reason: Created, Started, Pulled, DeploymentCreated, DeadlineExceeded, Scheduled, FailedSync, etc.
          // - eliminating history, mongodb-1-deploy, mongodb-2-deploy, mongodb-3-deploy, etc
          // - sort by involvedObject.kind (Pod, DeploymentConfig, )
          groups[namespace] = groups[namespace] || {};
          groups[namespace][name] = groups[namespace][name] || {
            heading: name,
            subheading: event.involvedObject.kind,
            notifications: {}
          };
          groups[namespace][name].notifications[event.metadata.uid] = {
            unread:  !_.get(cache, [namespace, uid, 'read']),
            message: event.message,
            // moment(event.lastTimestamp).format('LLL') -> March 6, 2017 3:15 PM (human readable)
            timeStamp: event.lastTimestamp,
            metadata: event.metadata,
            involvedObject: event.involvedObject,
            status: event.type,
            timestamp: null,
            actions: null
          };
        });

        // the pf-notification-drawer requires arrays, it uses [].forEach rather than
        // angular.forEach([]) internally.  Opening a bug as this could be more flexible:
        // https://github.com/patternfly/angular-patternfly/issues/429
        return _.reduce(
                groups,
                function(result, next, key) {
                  result[key] = _.values(next);
                  result[key].notifications = _.map(result[key].notifications, function(notification) {
                    return notification;
                  });
                  return result;
                }, {});
      };

      // TODO: consider LRUcache for limiting # of items we track,
      // provided that it can .dump() for us to store something in sessionStorage
      cache = load();

      var subscriptions = {};

      return {
        // subscribe to notifications for a given project
        // will setup DataService.watch('events') for that project,
        // process any cached data we have against the events being
        // watched, & call the callback function.
        subscribe: function(projName, cb) {
          // TODO: polling? do we need it?
          if(!subscriptions[projName]) {
            subscriptions[projName] = {
              callbacks: [],
              watch: DataService.watch('events', {namespace: projName}, function(data) {
                console.log('events', data.by('metadata.name'));
                _.each(subscriptions[projName].callbacks, function(callback) {
                  callback(processEvents(data));
                });
              })
            };
          }
          var cbIndex = (subscriptions[projName].callbacks.push(cb) -1);
          // handler to lookup cb when later unsubscribing
          return {
            projectName: projName,
            cbIndex: cbIndex
          };
        },
        // do we need a publish, to allow others to publish to the subscribed channels?
        publish: function() {
          console.log('publish', arguments);
        },
        // takes the object returned from .subscribe()
        // eliminates the callback form the list
        // closes the watch if it is no longer needed
        unsubscribe: function(handler) {
          subscriptions[handler.projectName].callbacks.splice(handler.cbIndex, 1);
          if(!subscriptions[handler.projectName].callbacks.length) {
            DataService.unwatch(subscriptions[handler.projectName].watch);
          }
        },
        markUnread: function(notification) {
          notification.unread = false;
          _.set(cache, [notification.metadata.namespace, notification.metadata.uid], {
            read: true,
            timestamp: Date.now() // TODO: in case we need to limit the cache
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
