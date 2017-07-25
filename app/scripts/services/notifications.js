'use strict';

angular
  .module('openshiftConsole')
  .factory('eventTypeOrganizer',
    function() {
      var cacheKey = 'events:sorted';
      // may not keep them in localStorage permanently, but is useful for now to
      // gather events over longer periods of time.
      var storageType = 'localStorage';
      var load = function() {
        return JSON.parse(window[storageType].getItem(cacheKey) || '{}');
      };
      var save = function(data) {
        window[storageType].setItem(cacheKey, JSON.stringify(data));
      };

      var cachedEvents = load();
      // pod  (kind)
      // - killed (reason)
      //   - "(Normal) nodejs-mongo-8: Need to kill pod "  (type) name: message
      return {
        sort: function(type, reason, kind, name, message) {
          var msg = `${name}: ${message}`;
          //var tier1 = `${kind} ${reason}`;
          cachedEvents[kind] = cachedEvents[kind] || {};
          cachedEvents[kind][reason] = cachedEvents[kind][reason] || {};
          cachedEvents[kind][reason][type] = cachedEvents[kind][reason][type] || [];
          if(!_.includes(cachedEvents[kind][reason][type], msg)) {
            cachedEvents[kind][reason][type].unshift(msg);
            // no need to keep excessive records...
          }
          // // if we want to limit...
          if(cachedEvents[kind][reason][type].length > 6) {
            cachedEvents[kind][reason][type].length = 6;
          }
          // cachedEvents[tier1] = cachedEvents[tier1] || {};
          // cachedEvents[tier1][type] = cachedEvents[tier1][type] || [];
          // if(!_.contains(cachedEvents[tier1][type], msg)) {
          //   cachedEvents[tier1][type].push(msg);
          // }
          save(cachedEvents);
        }
      };
    })
  .factory('notifications',
    function($rootScope, $routeParams, APIService, DataService, eventTypeOrganizer) {
      var cachedUserActions;
      var cachedUserActionsKey = 'notifications';
      var storageType = 'sessionStorage';
      var load = function() {
        return JSON.parse(window[storageType].getItem(cachedUserActionsKey) || '{}');
      };
      var save = function(data) {
        window[storageType].setItem(cachedUserActionsKey, JSON.stringify(data));
      };
      var cachedProcessedEvents = {};
      var getTypeIndex = function(type) {
        // TODO: verify these are correct
        var indexes = {
          // Applications
          DeploymentConfig: 0,
          ReplicationController: 0,
          ReplicaSet: 0,
          Deployment: 0,
          StatefulSet: 0,
          Pod: 0,
          Service: 0,
          Route: 0,
          HorizontalPodAutoscaler: 0,
          Binding: 0,
          // Builds
          BuildConfig: 1,
          Build: 1,
          Pipeline: 1,
          ImageStream: 1,
          // Storage
          PersistentVolumeClaim: 2
        };
        var index = indexes[type];
        if(typeof index !== 'number') {
          console.warn('MISSING INDEX:', type, APIService.kindToResource(type));
          console.warn('MISSING INDEX:', type, APIService.kindToResource(type));
          console.warn('MISSING INDEX:', type, APIService.kindToResource(type));
        }
        return indexes[type];
      };
      var isImportantEvent = function(event) {
        console.log('isImportantEvent');
        return true;
      };
      // TRELLO for adding build events:
      // https://trello.com/c/YiK7d5gs/1149-3-create-events-for-started-completed-failed-builds-builds
      // - TODO: white list proactively filter in, if we didnt discuss,
      //   prob drop? ie, routes for example. no need.
      // - TODO: if there are no items under a heading, we should hide the heading...
      // return _.transform(
      //   groups,
      //   function(resultGroups, nextGroup, namespace) {
      //     console.log('next?', nextGroup);
      //   }, {});
      // cached first so new subscriptions can get an immediate data set rather
      // than waiting for the next event firing
      // TODO: filtering options:
      // - event.type: Normal, Warning, etc.
      // - event.reason: Created, Started, Pulled, DeploymentCreated, DeadlineExceeded, Scheduled, FailedSync, etc.
      // - eliminating history, mongodb-1-deploy, mongodb-2-deploy, mongodb-3-deploy, etc
      // - sort by involvedObject.kind (Pod, DeploymentConfig, )
      var processEvents = function(data) {
        if(!data) {
          return []; // TODO: fix mo' betta
        }
        console.log('process', _.keys(data.by('metadata.name')).length);
        console.log('cache', cachedProcessedEvents);
        _.each(data.by('metadata.name'), function(event) {
          var namespace = event.involvedObject.namespace;
          var type = event.type;
          // TODO: type, reason, kind....
          var name = event.involvedObject.name;
          var uid = event.metadata.uid;
          var kind = event.involvedObject.kind;
          var index = getTypeIndex(kind);
          // there are 3 arrays for each namespace, matching the current menu structure:
          cachedProcessedEvents[namespace] = cachedProcessedEvents[namespace] ||  [{
            heading: 'Applications',
            // Applications: Deployments, Pods, StatefulSets, Services, Routes
            notifications: []
          },{
            heading: 'Builds',
            // Builds: Builds, Pipelines, Images
            notifications: []
          },{
            heading: 'Storage',
            // Storage: PVC
            notifications: []
          }];
          if(!cachedProcessedEvents[namespace][index]) {
            console.warn('missing, add to index list!', cachedProcessedEvents, namespace, index);
          }
          if(!isImportantEvent(event)) {
            return;
          }
          console.log('event to push', namespace, index, uid, event.message, event.lastTimestamp, event.metadata);
          cachedProcessedEvents[namespace][index].notifications.push({
            unread:  !_.get(cachedUserActions, [namespace, uid, 'read']),
            message: event.message,
            timestamp: event.lastTimestamp,
            metadata: event.metadata,
            involvedObject: event.involvedObject,
            status: event.type,
            reason: event.reason,
            actions: null
          });
          // console.log('[', event.type, '>', event.reason, event.involvedObject.kind,']', '(', event.involvedObject.name, ')');
          // console.log('   ', event.message);
          eventTypeOrganizer.sort(event.type, event.reason, event.involvedObject.kind, event.involvedObject.name, event.message);
        });
        return cachedProcessedEvents;
      };

      // TODO: consider LRUcachedUserActions for limiting # of items we track,
      // provided that it can .dump() for us to store something in sessionStorage
      cachedUserActions = load();

      var subscriptions = {};

      return {
        // subscribe to notifications for a given project
        // will setup DataService.watch('events') for that project,
        // process any cachedUserActionsd data we have against the events being
        // watched, & call the callback function.
        subscribe: function(projName, cb) {
          if(!projName) {
            return;
          }
          // TODO: polling? do we need it?
          if(!subscriptions[projName]) {
            subscriptions[projName] = {
              callbacks: [],
              watch: DataService.watch('events', {namespace: projName}, _.debounce(function(data) {
                _.each(subscriptions[projName].callbacks, function(callback) {
                  callback(processEvents(data));
                });
              }, 50), { skipDigest: true })
            };
          }
          var cbIndex = (subscriptions[projName].callbacks.push(cb) -1);
          // fire it once, in case we have data already but no current event
          if(cachedProcessedEvents) {
            cb(cachedProcessedEvents);
          }
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
          if(!handler) {
            return;
          }
          subscriptions[handler.projectName].callbacks.splice(handler.cbIndex, 1);
          if(!subscriptions[handler.projectName].callbacks.length) {
            DataService.unwatch(subscriptions[handler.projectName].watch);
          }
        },
        markRead: function(notification) {
          notification.unread = false;
          _.set(cachedUserActions, [notification.metadata.namespace, notification.metadata.uid], {
            read: true,
            timestamp: Date.now() // TODO: in case we need to limit the cachedUserActions
          });
          save(cachedUserActions);
        }
      };
    });
