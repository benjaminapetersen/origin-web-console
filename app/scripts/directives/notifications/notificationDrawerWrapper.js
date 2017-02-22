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
            notificationGroups: [{
              // TODO: link to the resource page if possible?
              heading: 'mongodb',
              subHeading: 'Deployment Config',
              notifications: [{
                unread: true,
                // TODO: this is text straight back from the event itself.
                // should we reformat it?  I imagine we have to deal with it as it is...
                message: 'Created new replication controller \"mongodb-2\" for version 2',
                status: 'info',
                timeStamp: Date.now(),
                actions: actions
              }, {
                message: 'Created new replication controller \"mongodb-3\" for version 3',
                status: 'info',
                unread: true
              }, {
                message: 'Created new replication controller \"mongodb-4\" for version 4',
                status: 'info',
                unread: false
              }]
            }],
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
              markRead: function(notification) { console.log('Mark read'); notification.unread = false; },
              handleAction: function() { console.log('Handle action'); },
              getNotficationStatusIconClass: function(notification) {
                switch (notification.status ) {
                  case 'info' :
                    return 'pficon pficon-info';
                  case 'error':
                    return 'pficon pficon-error-circle-o';
                  case 'warning':
                    return 'pficon pficon-warning-triangle-o';
                  case 'ok':
                    return 'pficon pficon-ok';
                }
              }
            }
          });

          notifications.subscribe('notification-drawer:show', function(data) {
            console.log('notification-drawer:show', data);
            $scope.$applyAsync(function() {
              $scope.drawerHidden = data.drawerHidden;
            });
          });

          // TODO: Do we need a service behind this to cache the events?
          // it looks like events fire frequently & maintain some history naturally...
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
