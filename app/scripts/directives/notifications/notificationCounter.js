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
        $scope.hideDrawer = true;
        $scope.notificationGroups = [{
          heading: 'heading',
          subheading: 'subjeading',
          notifications: [{
            unread: true,
            message: 'message 1',
            status: 'info'
          }, {
            unread: true,
            message: 'message 2',
            status: 'info'
          }]
        }];
        $scope.actionCallback = function() {
          console.log('hello world.');
        };
        $scope.show = function() {
          $scope.$applyAsync(function() {
            $scope.count = 0;
            $scope.hideDrawer = false;
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

        setInterval(function() {
          notifications.publish('notification:new', { foo: 'bar ' + $scope.count });
        }, 4000);
      }],
      link: function() {
        console.log('notification-counter.link()');
      },
      templateUrl: 'views/directives/notifications/notification-counter.html'
    };
  });
