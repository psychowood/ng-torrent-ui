'use strict';

describe('Service: uTorrentService', function () {

  // load the service's module
  beforeEach(module('ngTorrentUiApp'));

  // instantiate service
  var uTorrentService;
  beforeEach(inject(function (_uTorrentService_) {
    uTorrentService = _uTorrentService_;
  }));

  it('should do something', function () {
    expect(!!uTorrentService).toBe(true);
  });

});
