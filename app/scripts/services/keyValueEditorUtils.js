(function() {
  'use strict';

  // simple set of utils to share
  angular
    .module('openshiftConsole')
    .factory('keyValueEditorUtils', [
      function() {

        // these keys are for kve and, if this function is used, will be removed.
        var toClean = [
          // TODO: probably should have added a prefix, such as
          // `kve_*` to all of these to make it easier to clean up with certainty!
          'valueAlt',
          'isReadonly',
          'isReadonlyKey',
          'cannotDelete',
          'keyValidator',
          'valueValidator',
          'keyValidatorError',
          'valueValidatorError',
          'valueIcon',
          'valueIconTooltip',
          'keyValidatorErrorTooltip',
          'keyValidatorErrorTooltipIcon',
          'valueValidatorErrorTooltip',
          'valueValidatorErrorTooltipIcon',
          'selected',             // clean off ui-select stuff :/
          'selectedValueFrom',    // ui-select cleanup
          'selectedValueFromKey', // hmmm...
          'apiObject',            // we add this for navigateResourceURL lookups
          'refType'
        ];
        var cleanEntry = function(entry) {
          _.each(toClean, function(key) {
            entry[key] = undefined;   // ensure removal if set to an object
            delete entry[key];        // then eliminate key
          });
          return entry;
        };

        var cleanEntries = function(entries) {
          return _.map(entries, cleanEntry);
        };

        // cleans each entry of kve known keys and
        // drops any entry that has neither a key nor a value or valueFrom
        // NOTE: if the input validator fails to pass, then an
        // entry will not have a value and will be excluded. This
        // is not the fault of this function.
        var compactEntries = function(entries) {
          return _.compact(
                  _.map(
                    entries,
                    function(entry) {
                      entry = cleanEntry(entry);
                      return (entry.name || entry.value || entry.valueFrom) ? entry : undefined;
                    }));
        };

        // returns an object of key:value pairs, last one in will win:
        // {
        //  foo: 'bar',
        //  baz: 'bam'
        // }
        var mapEntries = function(entries) {
          Logger.log('DEPRECATED: mapEntries() drops valueFrom from the entry.');
          return _.reduce(
                  compactEntries(entries),
                  function(result, next) {
                    // valueFrom cannot be handled properly here.
                    result[next.name] = next.value;
                    return result;
                  }, {});
        };

        // in the case that an entry has a valueFrom pointing to a secret or config map,
        // this util will toggle the isReadonlyValue bool. Useful for quick swapping
        // the UI from ui-select pickers to a simple readonly state.
        var toggleReadonlyForEntryValueFrom = function(entry, bool) {
          if(entry.valueFrom && (entry.valueFrom.configMapKeyRef || entry.valueFrom.secretKeyRef)) {
            entry.isReadonlyValue = bool;
          }
        };

        var toggleReadonlyForEntriesValueFrom = function(entries, bool) {
          _.each(entries, function(entry) {
            toggleReadonlyForEntryValueFrom(entry, bool);
          });
        };

        return {
          cleanEntry: cleanEntry,
          cleanEntries: cleanEntries,
          compactEntries: compactEntries,
          mapEntries: mapEntries,
          toggleReadonlyForEntryValueFrom: toggleReadonlyForEntryValueFrom,
          toggleReadonlyForEntriesValueFrom: toggleReadonlyForEntriesValueFrom
        };
      }
    ]);
})();
