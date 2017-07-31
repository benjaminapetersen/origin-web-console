'use strict';

angular
  .module('openshiftConsole')
  .component('notificationCounter', {
    templateUrl: 'views/directives/notifications/notification-counter.html',
    bindings: {},
    controller: [
      '$routeParams',
      '$rootScope',
      'Constants',
      'DataService',
      function($routeParams, $rootScope, Constants, DataService) {
        var ENABLE_EVENTS = _.get(Constants, 'ENABLE_TECH_PREVIEW_FEATURE.events_in_notification_drawer');
        var counter = this;
        var drawerHidden = true;

        var rootScopeWatches = [];
        // this one is treated separately from the rootScopeWatches as
        // it may need to be updated outside of the lifecycle of init/destroy
        var notificationListener;

        var eventsWatcher;

        var deregisterEventsWatch = function() {
          if(eventsWatcher) {
            DataService.unwatch(eventsWatcher);
          }
        };

        var watchEvents = function(projectName, cb) {
          if(projectName && ENABLE_EVENTS) {
            eventsWatcher = DataService.watch('events', {namespace: projectName}, _.debounce(cb, 50), { skipDigest: true });
          }
        };

        var watchNotifications = function(projectName, cb) {
          if(!projectName) {
            return;
          }
          notificationListener = $rootScope.$on('NotificationsService.onNotificationAdded', cb);
        };

        var deregisterNotificationListener = function() {
          notificationListener && notificationListener();
        };

        var deregisterRootScopeWatches = function() {
          _.each(rootScopeWatches, function(deregister) {
            deregister();
          });
        };

        var toggleVisibility = function(projectName) {
          if(!projectName) {
            counter.hideCounter = true;
          }
          counter.showNewNotificationIndicator = true;
        };

        counter.onClick = function() {
          drawerHidden = !drawerHidden;
          counter.showNewNotificationIndicator = false;
          $rootScope.$emit('notification-drawer:show', {
            drawerHidden: drawerHidden
          });
        };

        var genericEventCallback = function() {
          counter.showNewNotificationIndicator = true;
        };

        var reset = function() {
          deregisterEventsWatch();
          deregisterNotificationListener();
          watchEvents($routeParams.project, genericEventCallback);
          watchNotifications($routeParams.project, genericEventCallback);
          toggleVisibility($routeParams.project);
        };

        counter.$onInit = function() {
          reset();
          rootScopeWatches.push($rootScope.$on("$routeChangeSuccess", function () {
            reset();
          }));
        };

        counter.$onDestroy = function() {
          deregisterEventsWatch();
          deregisterNotificationListener();
          deregisterRootScopeWatches();
        };
      }
    ]
  });
