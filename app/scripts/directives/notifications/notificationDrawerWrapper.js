'use strict';

angular
  .module('openshiftConsole')
  // shim for communicationg with pfNotificationDrawer
  .directive('notificationDrawerWrapper', function() {

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

    return {
      restrict: 'AE',
      scope: {},
      controller: function($interval, $routeParams, $scope, $rootScope, DataService, notifications) {

        angular.extend($scope, {
          drawerHidden: true,
          allowExpand: false, // doesnt seem necessary
          drawerExpanded: false,
          drawerTitle: 'Notifications',
          toggleShowDrawer: function() {
            $scope.hideDrawer = !$scope.hideDrawer;
          },
          notificationGroups: [],
          headingInclude: 'views/directives/notifications/heading.html',
          subheadingInclude: 'views/directives/notifications/subheading.html',
          notificationBodyInclude: 'views/directives/notifications/notification-body.html',
          notificationFooterInclude: 'views/directives/notifications/notification-footer.html',
          // essentially functions to pass to the notification-body
          customScope: {
            clearAll: function(group) {
              _.each(group.notifications, function(notification) {
                notifications.markUnread(notification);
              });
            },
            markRead: function(notification) {
              notifications.markRead(notification);
            },
            getNotficationStatusIconClass: function(notification) {
              return statuses[notification.status] || statusClasses.info;
            }
          }
        });

        // event from other nodes (counter) to signal the drawer to open/close
        $rootScope.$on('notification-drawer:show', function(evt, data) {
          $scope.$applyAsync(function() {
            $scope.drawerHidden = data.drawerHidden;
          });
        });

        var subscription = notifications.subscribe($routeParams.project, function(notificationGroups) {
          $scope.notificationGroups = notificationGroups[$routeParams.project] || [];
        });

        $scope.$on('$destroy', function() {
          notifications.unsubscribe(subscription);
        });
      },
      templateUrl: 'views/directives/notifications/notification-drawer-wrapper.html'
    };
  });
