'use strict';

angular
  .module('openshiftConsole')
  // primarily to wrap the pfNotificationDrawer
  // and give us a way to communicate with it
  .directive('notificationDrawerWrapper', function() {
    return {
      restrict: 'AE',
      scope: {},
      controller: [
        '$scope',
        '$interval',
        'notifications',
        function($scope, $interval, notifications) {
          angular.extend($scope, {
            drawerHidden: true,
            allowExpand: true,
            drawerExpanded: false,
            drawerTitle: 'Notifications',
            toggleShowDrawer: function() {
              $scope.hideDrawer = !$scope.hideDrawer;
            },
            notificationGroups: [{
              heading: 'Tab 1',
              subHeading: 'woohoo!',
              notifications: [{
                unread: true,
                message: 'Hello world',
                status: 'info',
                timeStamp: Date.now(),
                actions: [{
                  name: 'Foo',
                  title: 'Bar'
                }, {
                  message: 'Hello again'
                }, {
                  message: 'Lots of hello.'
                }]
              }]
            }],
            actionButtonTitle: 'Mark All Read',
            actionButtonCallback: function() {
              console.log('drawer.actionCallback() - Mark All Read');
            },
            // TODO:
            // retry with {{headingInclude}}
            // and then comment back on
            // https://github.com/patternfly/angular-patternfly/issues/419#issuecomment-280478557
            headingInclude: 'views/directives/notifications/heading.html',
            subheadingInclude: 'views/directives/notifications/subheading.html',
            notificationBodyInclude: 'views/directives/notifications/notification-body.html',
            notificationFooterInclude: 'views/directives/notifications/notification-footer.html',
            // TODO: I believe this is for a single group, not a single notification
            customScope: {
              clearAll: function() {}
            }
          });

          notifications.subscribe('notification-drawer:show', function(data) {
            console.log('notification-drawer:show', data);
            $scope.$applyAsync(function() {
              $scope.drawerHidden = data.drawerHidden;
            });
          });

          // TODO: need to add to the notificationGroups... or
          // perhaps use a service as a cache to ensure isn't destroyed on
          // page load/renders?  should be a single source of truth for data.
          // notifications.subscribe('notification:new', function(data) {
          //   $scope.$applyAsync(function() {
          //     console.log('drawer data:', data);
          //   });
          // });
        }
      ],
      link: function() {
        //console.log('notificationDrawerWrapper.link()');
      },
      templateUrl: 'views/directives/notifications/notification-drawer-wrapper.html'
    };
  });
