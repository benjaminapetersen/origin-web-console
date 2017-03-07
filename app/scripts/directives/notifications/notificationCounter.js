'use strict';

angular
  .module('openshiftConsole')
  .directive('notificationCounter', function() {
    return {
      restrict: 'AE',
      scope: {},
      controller:
        function($scope, $routeParams, $rootScope, notifications) {
        $scope.count = 0;
        $scope.countDisplay = $scope.count;
        var drawerHidden = true;

        $scope.onClick = function() {
          $scope.$applyAsync(function() {
            $scope.count = 0;
          });
          drawerHidden = !drawerHidden;
          $rootScope.$emit('notification-drawer:show', {
            drawerHidden: drawerHidden
          });
        };

        // TODO: just need to know if there is a "new" notification worth viewing,
        // don't need to give the user a ping for every time the watch returns data
        var subscription = notifications.subscribe($routeParams.project, function(groups) {
          $scope.groups = groups;
          $scope.count++;
          $scope.countDisplay = $scope.count < 100 ?
                                  $scope.count:
                                  '! !'; // TODO: a "too many!" indicator
        });

        $scope.$on('$destroy', function() {
          notifications.unsubscribe(subscription);
        });
      },
      templateUrl: 'views/directives/notifications/notification-counter.html'
    };
  });
