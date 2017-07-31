'use strict';

angular
  .module('openshiftConsole')
  // shim for communicationg with pfNotificationDrawer
  .component('notificationDrawerWrapper', {
    templateUrl: 'views/directives/notifications/notification-drawer-wrapper.html',
    controller: [
      '$interval',
      '$timeout',
      '$routeParams',
      '$rootScope',
      'Constants',
      'DataService',
      'NotificationsService',
      'EventCache',
      function(
        $interval,
        $timeout,
        $routeParams,
        $rootScope,
        Constants,
        DataService,
        NotificationsService,
        EventCache) {

        var ENABLE_EVENTS = _.get(Constants, 'ENABLE_TECH_PREVIEW_FEATURE.events_in_notification_drawer');
        var drawer = this;

        // global event watches
        var rootScopeWatches = [];
        // this one is treated separately from the rootScopeWatches as
        // it may need to be updated outside of the lifecycle of init/destroy
        var notificationListener;

        var eventsWatcher;
        var eventsFromWatch = [];
        var internalNotifications = [];

        var notificationGroupsMap = {};
        var notificationGroups = [];

        var addProjectToNotificationGroups = function(projectName) {
          if(projectName && !notificationGroupsMap[projectName]) {
            notificationGroupsMap[projectName] = {
              heading: projectName,
              notifications: []
            };
          }
        };

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

        // NotificationService notifications are minimal, they do no necessarily contain projectName info.
        // ATM tacking this on via watching the current project.
        var watchNotifications = function(projectName, cb) {
          if(!projectName) {
            return;
          }
          notificationListener = $rootScope.$on('NotificationsService.onNotificationAdded', cb);
        };

        var deregisterNotificationListener = function() {
          notificationListener && notificationListener();
        };

        var isImportantEvent = function(event) {
          return event.type === 'Warning';
          return true;
        };

        // notificationGroups[projectName]
        var eventWatchCallback = function(eventData) {
          var eventsByName = eventData.by('metadata.name');
          console.log('events by name', eventsByName);
          // process into the map
          // TODO: Get NotificationService.onNotificationAdded in here.
          _.each(eventsByName, function(event) {
            if(isImportantEvent(event)) {
              // TODO: deduplicate events?
              // events in etcd should be deduplicated already, having the count incremented,
              // however, we probably have to further deduplicate them.
              notificationGroupsMap[event.metadata.namespace].notifications.push({
                // TODO: will need cache to track read/unread
                unread:  false, // !_.get(cachedUserActions, [namespace, uid, 'read'])
                message: event.message,
                timestamp: event.lastTimestamp,
                metadata: event.metadata,
                involvedObject: event.involvedObject,
                status: event.type,
                reason: event.reason,
                actions: null
              });
            }
          });
          // sort map into array
          notificationGroups = _.sortBy(notificationGroupsMap, function(group) {
            group.open = false;
            return group.heading;
          });
          _.first(notificationGroups).open = true;

          $rootScope.$apply(function () {
            drawer.notificationGroups = notificationGroups;
          });
        };

        var notificationWatchCallback = function(event, notification) {
          internalNotifications.push(notification);
          console.log('Compare all notifications to the ones cached here');
          console.log('local cache:', internalNotifications);
          console.log('service cache', NotificationsService.getNotifications());
          drawer.notificationGroups = [{
            heading: 'Notifications 1 for (no proj!)',
            notifications: internalNotifications
          }, {
            heading: 'Notifications 2 for (no proj!)',
            notifications: NotificationsService.getNotifications()
          }];
        };

        var deregisterRootScopeWatches = function() {
          _.each(rootScopeWatches, function(deregister) {
            deregister();
          });
        };

        var toggleDrawerVisibility = function(projectName) {
          if(!projectName) {
            drawer.drawerHidden = true;
          }
        };

        var statusClasses = {
          info: 'pficon pficon-info',
          error: 'pficon pficon-error-circle-o',
          warning: 'pficon pficon-warning-triangle-o',
          ok: 'pficon pficon-ok'
        };

        var statuses = {
          Normal: statusClasses.info,
          Warning: statusClasses.warning
          // more...
        };

        angular.extend(drawer, {
          drawerHidden: true,
          allowExpand: true,
          drawerExpanded: false,
          drawerTitle: 'Notifications',
          onClose: function() {
            drawer.drawerHidden = true;
          },
          onClearAll: function() {
            console.log('onClearAll');
          },
          toggleShowDrawer: function() {
            drawer.hideDrawer = !drawer.hideDrawer;
          },
          notificationGroups: notificationGroups,
          headingInclude: 'views/directives/notifications/heading.html',
          subheadingInclude: 'views/directives/notifications/subheading.html',
          notificationBodyInclude: 'views/directives/notifications/notification-body.html',
          notificationFooterInclude: 'views/directives/notifications/notification-footer.html',
          // essentially functions to pass to the notification-body
          customScope: {
            clearAll: function(group) {
              console.log('clearAll', group);
              // _.each(group.notifications, function(notification) {
              //   notifications.markUnread(notification);
              // });
            },
            markRead: function(notification) {
              console.log('markUnread', notification);
              // notifications.markRead(notification);
            },
            getNotficationStatusIconClass: function(notification) {
              return statuses[notification.status] || statusClasses.info;
            }
          }
        });

        var reset = function() {
          addProjectToNotificationGroups($routeParams.project);
          deregisterEventsWatch();
          deregisterNotificationListener();
          watchEvents($routeParams.project, eventWatchCallback);
          watchNotifications($routeParams.project, notificationWatchCallback);
          toggleDrawerVisibility($routeParams.project);
        };

        drawer.$onInit = function() {
          reset();
          // $routeChangeSuccess seems more reliable than $locationChangeSuccess:
          // - it fires once on initial load. $locationChangeSuccess does not.
          // - it waits for more object resolution (not a huge deal in this use case)
          // - tracks route data instead of urls (args to callback fn)
          rootScopeWatches.push($rootScope.$on("$routeChangeSuccess", function () {
            reset();
          }));

          // event from other nodes (counter) to signal the drawer to open/close
          rootScopeWatches.push($rootScope.$on('notification-drawer:show', function(evt, data) {
            drawer.drawerHidden = data.drawerHidden;
          }));
        };

        drawer.$onDestroy = function() {
          deregisterNotificationListener();
          deregisterEventsWatch();
          deregisterRootScopeWatches();
        };

      }
    ]
  });
