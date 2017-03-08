'use strict';

describe('keyValueEditorUtils', function() {
  var utils;

  // beforeEach(angular.mock.module('key-value-editor'));
  beforeEach(function() {
    inject(function(_keyValueEditorUtils_) {
        utils = _keyValueEditorUtils_;
    });
  });

  describe('newEntry', () => {
    expect(utils.newEntry()).toEqual({
      name: '',
      value: ''
    });
  });

  describe('addEntry', () => {
    expect(utils.addEntry(1, [])).toEqual([1]);
  });

  describe('addEntryWithSelectors', () => {

  });

  describe('altTextForValueFrom', () => {

  });

  describe('setEntryPerms', () => {

  });

  // a typical entry is of the format: {name: '', value: ''}
  // additional keys are added to entries to control the display/interaction of the
  // key-value-editor.  These keys can be removed to 'clean up' the data itself
  // to return to the user.
  var meta = [
    'apiObj',
    'cannotDelete',
    'isReadonly',
    'isReadonlyKey',
    'isReadonlyValue',
    'keyValidator',
    'keyValidatorError',
    'keyValidatorErrorTooltip',
    'keyValidatorErrorTooltipIcon',
    'refType',
    'selected',
    'selectedValueFrom',
    'selectedValueFromKey',
    'valueValidatorError',
    'valueIcon',
    'valueIconTooltip',
    'valueAlt',
    'valueValidator',
    'valueValidatorErrorTooltip',
    'valueValidatorErrorTooltipIcon'
  ];

  describe('cleanEntry()', function() {
    it('removes metadata from an entry object', function() {
      var cleanEntry = utils.cleanEntry;
      var obj = {name: 'foo', value: 'bar'};
      _.each(meta, function(item) {
        obj[item] = 'this should be removed';
      });
      expect(cleanEntry(obj)).toEqual({name: 'foo', value: 'bar'});
    });
  });


  describe('cleanEntries()', function() {
    it('removes metadata from each entry in a list of entries', function() {
      var entries = [
        {name:'foo', value:'bar'},
        {name: 'shizzle', value: 'pop'}
      ];
      _.each(entries, function(entry) {
        _.each(meta, function(item) {
          entry[item] = 'this should be removed';
        });
      });
      expect(utils.cleanEntries(entries)).toEqual([
        {name:'foo', value:'bar'},
        {name: 'shizzle', value: 'pop'}
      ]);
    });
  });

  describe('compactEntries()', function() {
    it('removes metadata from each entry and eliminates entries without a defined name or value', function() {
      var entries = [
        {name:'foo', value:'bar'},
        {name: 'shizzle', value: 'pop'},
        {name: '', value: ''},
        {name: undefined, value: null}
      ];
      _.each(entries, function(entry) {
        _.each(meta, function(item) {
          entry[item] = 'this should be removed';
        });
      });
      expect(utils.compactEntries(entries)).toEqual([
        {name:'foo', value:'bar'},
        {name: 'shizzle', value: 'pop'}
      ]);
    });
  });

  describe('mapEntries()', function() {
    it('turns a list of entries into a map of name: "value" pairs', function() {
      var entries = [
        {name:'foo', value:'bar'},
        {name: 'shizzle', value: 'pop'}
      ];
      expect(utils.mapEntries(entries)).toEqual({
        foo: 'bar',
        shizzle: 'pop'
      });
    });
  });

  describe('setFocusOn', () => {

  });

  describe('uniqueForKey', () => {
    it('should create a unique key string', () => {
      expect(utils.uniqueForKey('foo', 5)).toEqual('key-value-editor-key-foo-5');
    });
  });

  describe('uniqueForValue', () => {
    it('should create a unique key string', () => {
      expect(utils.uniqueForValue('foo', 5)).toEqual('key-value-editor-value-foo-5');
    });
  });


  describe('findReferenceValue', () => {

  });

  describe('findReferenceValueForEntries', () => {

  });


});
