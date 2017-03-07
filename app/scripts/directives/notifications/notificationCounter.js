'use strict';

angular
  .module('openshiftConsole')
  .directive('notificationCounter', function() {
    return {
      restrict: 'AE',
      scope: {},
      controller:
        function($scope, $rootScope, notifications) {
        $scope.count = 0;
        $scope.countDisplay = $scope.count;
        var drawerHidden = true;

        $scope.onClick = function() {
          $scope.$applyAsync(function() {
            $scope.count = 0;
            drawerHidden = !!drawerHidden;
          });
          drawerHidden = !drawerHidden;
          $rootScope.$emit('notification-drawer:show', {
            drawerHidden: drawerHidden
          });
        };
        var off = $rootScope.$on('notification:new', function(evt, data) {
          $scope.$applyAsync(function() {
            $scope.count++;
            $scope.countDisplay = $scope.count < 100 ?
                                    $scope.count:
                                    '! !'; // TODO: a "too many!" indicator
          });
        });
        $scope.$on('$destroy', function() {
          off();
        });
      },
      link: function() {
        console.log('notification-counter.link()'); // just ensuring it renders
      },
      templateUrl: 'views/directives/notifications/notification-counter.html'
    };
  });
