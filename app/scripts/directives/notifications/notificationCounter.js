'use strict';

angular
  .module('openshiftConsole')
  .directive('notificationCounter', function() {
    return {
      restrict: 'AE',
      scope: {},
      controller: [
        '$scope',
        'notifications',
        function($scope, notifications) {
        $scope.count = 0;
        $scope.countDisplay = $scope.count;
        var drawerHidden = true; 

        $scope.onClick = function() {
          $scope.$applyAsync(function() {
            $scope.count = 0;
            $scope.hideDrawer = false;
          });
          drawerHidden = !drawerHidden;
          notifications.publish('notification-drawer:show', {
            drawerHidden: drawerHidden
          });
        };
        notifications.subscribe('notification:new', function() {
          $scope.$applyAsync(function() {
            $scope.count++;
            $scope.countDisplay = $scope.count < 100 ?
                                    $scope.count:
                                    '! !'; // TODO: a "too many!" indicator
          });
        });
      }],
      link: function() {
        console.log('notification-counter.link()'); // just ensuring it renders
      },
      templateUrl: 'views/directives/notifications/notification-counter.html'
    };
  });
