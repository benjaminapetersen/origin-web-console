'use strict';

angular
  .module('openshiftConsole')
  // shim for communicationg with pfNotificationDrawer
  .component('notificationDrawerWrapper', {
    templateUrl: 'views/directives/notifications/notification-drawer-wrapper.html',
    controller: [
      '$filter',
      '$interval',
      '$timeout',
      '$routeParams',
      '$rootScope',
      'Constants',
      'DataService',
      'NotificationsService',
      'EventsService',
      function(
        $filter,
        $interval,
        $timeout,
        $routeParams,
        $rootScope,
        Constants,
        DataService,
        NotificationsService,
        EventsService) {


        // kill switch if watching events is too expensive
        var ENABLE_EVENT_WATCH = _.get(Constants, 'FEATURE_FLAGS.global_event_watch_for_notification_drawer');
        var drawer = this;

        // global event watches
        var rootScopeWatches = [];
        // this one is treated separately from the rootScopeWatches as
        // it may need to be updated outside of the lifecycle of init/destroy
        var notificationListener;

        var eventsWatcher;
        var eventsFromNotifications = [];

        // TODO:
        // include both Notifications & Events,
        // rather than destroying the map each time maintain it & add new items
        var notificationGroupsMap = {};
        var notificationGroups = [];

        var projects = {};

        var listProjects = function() {
          return DataService.list("projects", {}, function(items) {
            projects = items.by("metadata.name");
          });
        };

        var ensureProjectGroupExists = function(groups, projectName) {
          if(projectName && !groups[projectName]) {
            groups[projectName] = {
              heading: $filter('displayName')(projects[projectName]) || projectName,
              project: projects[projectName],
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
          if(projectName && ENABLE_EVENT_WATCH) {
            eventsWatcher = DataService.watch('events', {namespace: projectName}, _.debounce(cb, 400), { skipDigest: true });
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

        var unread = function(notifications) {
          return _.filter(notifications, 'unread');
        };

        // returns a count for each type of notification, example:
        // {Normal: 1, Warning: 5}
        var countUnreadNotificationsForGroup = function(group) {
          return _.countBy(unread(group.notifications), function(notification) {
            return notification.status;
          });
        };

        // currently we only show 1 at a time anyway
        var countUnreadNotificationsForAllGroups = function() {
          _.each(drawer.notificationGroups, function(group) {
            group.counts = countUnreadNotificationsForGroup(group);
          });
        };

        var countAllUnread = function(group) {
          return _.reduce(group.counts, function(result, count) {
            return result + count;
          }, 0);
        };

        var sortNotifications = function(notifications) {
          return _.sortBy(notifications, function(notification) {
            return -(new Date(notification.lastTimestamp));
          });
        };

        var sortNotificationGroups = function(groupsMap) {
          // convert the map into a sorted array
          var sortedGroups = _.sortBy(groupsMap, function(group) {
            return group.heading;
          });
          // and sort the notifications under each one
          _.each(sortedGroups, function(group) {
            group.notifications = sortNotifications(group.notifications);
            group.counts = countUnreadNotificationsForGroup(group);
          });
          return sortedGroups;
        };

        var formatFilteredEvents = function(eventMap) {
          var filtered = {};
          _.each(eventMap, function(event) {
            if(EventsService.isImportantEvent(event)) {
              ensureProjectGroupExists(filtered, event.metadata.namespace);
              filtered[event.metadata.namespace].notifications.push({
                unread:  !EventsService.isRead(event),
                message: event.message,
                lastTimestamp: event.lastTimestamp,
                metadata: event.metadata,
                involvedObject: event.involvedObject,
                name: event.involvedObject.name,
                kind: event.involvedObject.kind,
                namespace: event.involvedObject.namespace,
                status: event.type,
                reason: event.reason,
                actions: null
              });
            }
          });
          return filtered;
        };

        var eventWatchCallback = function(eventData) {
          var eventsByName = eventData.by('metadata.name');

          notificationGroupsMap = formatFilteredEvents(eventsByName);
          notificationGroups = sortNotificationGroups(notificationGroupsMap);

          $rootScope.$apply(function () {
            // NOTE: we are currently only showing one project in the drawer at a
            // time. If we go back to multiple projects, we can eliminate the filter here
            // and just pass the whole array as notificationGroups.
            // if we do, we will have to handle group.open to keep track of what the
            // user is viewing at the time & indicate to the user that the non-active
            // project is "asleep"/not being watched.
            drawer.notificationGroups = _.filter(notificationGroups, function(group) {
              return group.project.metadata.name === $routeParams.project;
            });
          });
        };

        // TODO: atm these are not being added to the notificationGroups
        var notificationWatchCallback = function(event, notification) {
          if(!notification.lastTimestamp) {
            notification.lastTimestamp = new Date();
          }
          eventsFromNotifications.push(notification);
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
        };

        angular.extend(drawer, {
          drawerHidden: true,
          allowExpand: true,
          drawerExpanded: false,
          drawerTitle: 'Notifications',
          counts: {},
          onClose: function() {
            drawer.drawerHidden = true;
          },
          notificationGroups: notificationGroups,
          headingInclude: 'views/directives/notifications/heading.html',
          subheadingInclude: 'views/directives/notifications/subheading.html',
          notificationBodyInclude: 'views/directives/notifications/notification-body.html',
          notificationFooterInclude: 'views/directives/notifications/notification-footer.html',
          //
          customScope: {
            clearAll: function(group) {
              _.each(group.notifications, function(notification) {
                notification.unread = false;
                EventsService.markRead(notification);
              });
            },
            markRead: function(notification) {
              notification.unread = false;
              EventsService.markRead(notification);
              countUnreadNotificationsForAllGroups();
            },
            getNotficationStatusIconClass: function(notification) {
              return statuses[notification.status] || statusClasses.info;
            },
            getStatusForCount:  function(countKey) {
              return statuses[countKey] || statusClasses.info;
            },
            countAllUnread: function(group) {
              return countAllUnread(group);
            },
            hasUnread: function(group) {
              return !!countAllUnread(group);
            }
          }
        });

        var reset = function() {
          listProjects().then(function() {
            deregisterEventsWatch();
            deregisterNotificationListener();
            watchEvents($routeParams.project, eventWatchCallback);
            watchNotifications($routeParams.project, notificationWatchCallback);
            toggleDrawerVisibility($routeParams.project);
          });
        };

        drawer.$onInit = function() {
          reset();
          // $routeChangeSuccess seems more reliable than $locationChangeSuccess:
          // - it fires once on initial load. $locationChangeSuccess does not.
          // - it waits for more object resolution (not a huge deal in this use case)
          // - tracks route data instead of urls (args to callback fn, also not
          //   necessary for the current use case)
          rootScopeWatches.push($rootScope.$on("$routeChangeSuccess", function () {
            drawer.customScope.projectName = $routeParams.project;
            reset();
          }));

          // event from the counter to signal the drawer to open/close
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
