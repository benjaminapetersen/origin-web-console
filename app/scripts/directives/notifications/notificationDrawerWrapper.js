'use strict';

angular
  .module('openshiftConsole')
  // primarily to wrap the pfNotificationDrawer
  // and give us a way to communicate with it
  .directive('notificationDrawerWrapper', function() {

    var statuses = {
      info: 'pficon pficon-info',
      error: 'pficon pficon-error-circle-o',
      warning: 'pficon pficon-warning-triangle-o',
      ok: 'pficon pficon-ok'
    };

    return {
      restrict: 'AE',
      scope: {},
      controller: function($interval, $routeParams, $scope, $rootScope, DataService, notifications) {
        var actions = [{
          name: 'Action 1',
          title: 'Action 1 title'
        }];

        angular.extend($scope, {
          drawerHidden: true,
          allowExpand: true,
          drawerExpanded: false,
          drawerTitle: 'Notifications',
          toggleShowDrawer: function() {
            $scope.hideDrawer = !$scope.hideDrawer;
          },
          notificationGroups: [],
          actionButtonTitle: 'Mark All Read',
          actionButtonCallback: function() {
            console.log('drawer.actionCallback() - Mark All Read');
          },
          headingInclude: 'views/directives/notifications/heading.html',
          subheadingInclude: 'views/directives/notifications/subheading.html',
          notificationBodyInclude: 'views/directives/notifications/notification-body.html',
          notificationFooterInclude: 'views/directives/notifications/notification-footer.html',
          // essentially functions to pass to the notification-body
          customScope: {
            clearAll: function() { console.log('Clear all'); },
            markRead: function(notification) {
              notifications.markUnread(notification);
            },
            handleAction: function() { console.log('Handle action'); },
            getNotficationStatusIconClass: function(notification) {
              return statuses[notification.status] || statuses.info;
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
          $scope.notificationGroups = notificationGroups[$routeParams.project];
        });

        $scope.$on('$destroy', function() {
          notifications.unsubscribe(subscription);
        });
      },
      templateUrl: 'views/directives/notifications/notification-drawer-wrapper.html'
    };
  });
