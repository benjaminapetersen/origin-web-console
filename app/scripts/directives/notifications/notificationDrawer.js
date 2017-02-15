'use strict';

angular
  .module('openshiftConsole')
  // primarily to wrap the pfNotificationDrawer
  // and give us a way to communicate with it
  .directive('notificationDrawer', function() {
    return {
      restrict: 'AE',
      scope: {},
      controller: [
        '$scope',
        'notifications',
        function($scope, notifications) {
          console.log('notificationDrawer.ctrl()');

          angular.extend($scope, {
            notificationGroups: [],
            hidden: false,
            allowExpand: true,
            drawerTitle: 'Notifications',
            actionButtonTitle: 'Do Things...',
            actionButtonCallback: function() {
              console.log('drawer.actionCallback()');
            }
          });

          notifications.subscribe('notification:new', function(data) {
            $scope.$applyAsync(function() {
              console.log('drawer data:', data);
            });
          });
        }
      ],
      link: function() {
        console.log('notificationDrawer.link()');
      },
      templateUrl: 'views/directives/notifications/notification-drawer.html'
    };
  });
