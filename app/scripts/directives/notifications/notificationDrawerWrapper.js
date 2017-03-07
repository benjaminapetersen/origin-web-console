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
        '$routeParams',
        '$scope',
        '$interval',
        'DataService',
        'notifications',
        function($routeParams, $scope, $interval, DataService, notifications) {
          var actions = [{
            name: 'Action 1',
            title: 'Action 1 title'
          }];
          var watches = [];

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

          // the directive is destroyed & recreated on every page change.
          // - this is handy since we can see the project change...
          // - this is not handy as we are creating & tearing down the watch over and over...
          //   - but, we do this on every page.
          watches.push(DataService.watch('events', { namespace: $routeParams.project },function(data) {
            console.log('events', data.by('metadata.name'));
            console.log('event count:', Object.keys(data.by('metadata.name')).length);
            console.log('messages:', _.map(data.by('metadata.name'), 'message'));
            var notificationGroupMap = {};
            _.each(data.by('metadata.name'), function(event) {
              // TODO: namespace relevance?
              notificationGroupMap[event.involvedObject.name] = notificationGroupMap[event.involvedObject.name] || {
                heading: event.involvedObject.name,
                subheading: event.involvedObject.kind,
                notifications: []
              };
              notificationGroupMap[event.involvedObject.name].notifications.push({
                unread: true,
                message: event.message,
                status: 'info',
                timestamp: null,
                actions: null
              });
            });

            $scope.notificationGroups = _.map(notificationGroupMap, function(group) {
              return group;
            });
            // TODO: publish out new events sets? count them? who should own this?
            // - Directives shouldn't really own this... thats odd.  Service should own it,
            //   publish it out to the 2 directives, the counter & the notification drawer.
            // - Directives can talk back to the service for this data.
            // - But, need the service "alive" right away, when the app starts up.  Is this a
            //   valid use of 'run'?
            // - how to keep track of read, unread, and persist this in storage?
            //   - event.metadata.uid is unique
            //   - event.metadata.creationTimestamp gives a date
            // - how to purge old data but keep the new?
          }, function() {
            console.log('MASSIVE EPIC FAILS YO, FAILS SO HARD');
          }));

          // TODO: Do we need a service behind this to cache the events?
          // it looks like events fire frequently & maintain some history naturally...
          // notifications.subscribe('notification:new', function(data) {
          //   $scope.$applyAsync(function() {
          //     console.log('drawer data:', data);
          //   });
          // });

          $scope.$on('$destroy', function(){
            DataService.unwatchAll(watches);
          });
        }
      ],
      link: function() {
        //console.log('notificationDrawerWrapper.link()');
      },
      templateUrl: 'views/directives/notifications/notification-drawer-wrapper.html'
    };
  });
