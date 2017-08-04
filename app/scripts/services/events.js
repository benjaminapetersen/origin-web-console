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


  // TODO: decide if this/these maps should be pulled out into
  // constants.js, so that they can be easily configured if so desired.
  // if so, a flat map is probably preferrable to multiple maps, even though
  // we can more easily programmatically show/hide events with multiple
  // maps.  Example: Pod SuccessfulCreate: hide, but show a SuccessfulCreate
  // for other resources
  //
  // CRUD reasons are duplicated across kinds,
  // but we don't actually want to see all kinds.
  // CRUDkindsToHide is a blacklist.
  // var CRUDkindsToHide = {
  //   // Pod
  // };
  var CRUDreasonsToShow = {
    // success
    // SuccessfulCreate: true, spammy
    // fail
    FailedCreate: true,
    FailedDelete: true,
    FailedUpdate: true,
  };

  // TODO: if this goes into Constants.js, it would be
  // ideal if it isn't binary, but an object:
  // { drawer: true, toast: true  }
  var uniqueReasonsToShow = {
    // Build
    BuildStarted: true,
    BuildCompleted: true,
    BuildFailed: true,
    BuildCancelled: true,
    // BuildConfig
    //
    // Deployment
    Failed: true,
    ScalingReplicaSet: true,
    DeploymentCancelled: true,
    // DeploymentConfig
    DeploymentCreated: true,
    DeploymentCreationFailed: true,
    // Pod
    FailedSync: true,
    // SuccessfulDelete: true,
    // Cron
    //
    // PodAutoscaler
    SuccessfulRescale: true,
    FailedRescale: true,
    // Service
    LoadBalancerUpdateFailed: true,
    // PVC
    VolumeDeleted: true,
    FailedBinding: true,
    ProvisioningFailed: true
  };

  // TODO: remove
  var tempLogger = {
    Normal: console.log,
    Warning: console.warn
  };

  var isImportantEvent = function(event) {
    var kind = event.involvedObject.kind;
    var type = event.type;
    var reason = event.reason;
    // TODO: remove, this logger was just used to map event.type to console[method]
    // tempLogger[type](kind, reason, type, event.message);
    return CRUDreasonsToShow[reason] || uniqueReasonsToShow[reason]; // || (type === 'Warning');
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
