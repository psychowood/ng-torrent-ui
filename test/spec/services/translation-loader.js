'use strict';

describe('Service: translationLoader', function () {

  // load the service's module
  beforeEach(module('utorrentNgwebuiApp'));

  // instantiate service
  var translationLoader;
  beforeEach(inject(function (_translationLoader_) {
    translationLoader = _translationLoader_;
  }));

  it('should do something', function () {
    expect(!!translationLoader).toBe(true);
  });

});
