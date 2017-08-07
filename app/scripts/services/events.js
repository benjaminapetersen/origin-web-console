'use strict';

angular.module('openshiftConsole').factory('EventsService', function() {

  // TODO: decide if sessionStorage/localStorage should just be a service itself
  var cacheKey = 'events-read';
  var storageType = 'sessionStorage';
  var load = function() {
    return JSON.parse(window[storageType].getItem(cacheKey) || '{}');
  };
  var save = function(data) {
    window[storageType].setItem(cacheKey, JSON.stringify(data));
  };
  var cachedEvents = load() || {};

  var EVENTS_TO_SHOW_BY_REASON = _.get(window, 'OPENSHIFT_CONSTANTS.EVENTS_TO_SHOW');

  var isImportantEvent = function(event) {
    var reason = event.reason;
    return EVENTS_TO_SHOW_BY_REASON[reason]; // || (type === 'Warning');
  };

  var markRead = function(event) {
    cachedEvents[event.metadata.uid] = true;
    save(cachedEvents);
  };

  var isRead = function(event) {
    return cachedEvents[event.metadata.uid];
  };

  return {
    isImportantEvent: isImportantEvent,
    markRead: markRead,
    isRead: isRead
  };
});
