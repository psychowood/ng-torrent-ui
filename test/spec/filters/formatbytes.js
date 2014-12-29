'use strict';

describe('Filter: formatBytes', function () {

  // load the filter's module
  beforeEach(module('ngTorrentUiApp'));

  // initialize a new instance of the filter before each test
  var formatBytes;
  beforeEach(inject(function ($filter) {
    formatBytes = $filter('formatBytes');
  }));

  it('should return the input prefixed with "formatBytes filter:"', function () {
    var text = 'angularjs';
    expect(formatBytes(text)).toBe('formatBytes filter: ' + text);
  });

});
