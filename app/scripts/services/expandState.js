'use strict';

// This service maintains expand/collapse state via sessionStorage
// for any object using it.
angular.module('openshiftConsole').factory('expandState', function() {

  var expandedKey = function(apiObject) {
    var uid = _.get(apiObject, 'metadata.uid');
    if (!uid) {
      return null;
    }

    return 'overview/expand/' + uid;
  };

  // HMMM.... ROW? Why ROW? Need to factor this out into somethign generic,
  // not sure if it needs to be
  var setInitialExpandedState = function(row) {
    var key = expandedKey(row.apiObject);
    if (!key) {
      row.expanded = false;
      return;
    }

    var item = sessionStorage.getItem(key);
    if (!item && row.state.expandAll) {
      row.expanded = true;
      return;
    }

    row.expanded = item === 'true';
  };

  return {
    expandedKey: expandedKey,
    setInitialExpandedState: setInitialExpandedState
  };

});
