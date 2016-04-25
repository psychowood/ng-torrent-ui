'use strict';

describe('Service: torrentServerService', function () {

  // load the service's module
  beforeEach(module('ngTorrentUiApp'));

  // instantiate service
  var torrentServerService;
  beforeEach(inject(function (_torrentServerService_) {
    torrentServerService = _torrentServerService_;
  }));

  it('should do something', function () {
    expect(!!torrentServerService).toBe(true);
  });

});
