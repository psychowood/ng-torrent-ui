'use strict';

/**
 * @ngdoc overview
 * @name ngTorrentUiAppDemo
 * @description
 * # ngTorrentUiAppDemo
 *
 * Main module of the demo application.
 */
angular.module('ngTorrentUiAppDemo', ['ngTorrentUiApp','ngMockE2E','ipsum']).run(function ($httpBackend,$log,$window,ipsumService) {
  // let all views through (the actual html views from the views folder should be loaded)
  $httpBackend.whenGET(new RegExp('views\/.*')).passThrough();
  $httpBackend.whenGET(new RegExp('scripts\/.*')).passThrough();
  $httpBackend.whenGET(new RegExp('styles\/.*')).passThrough();
  $httpBackend.whenGET(new RegExp('langs\/.*')).passThrough();
  $httpBackend.whenGET(new RegExp('bower.json')).passThrough();

  var rand = function(max){
    return Math.floor((Math.random()*max)+1);
  };

  var randInArr = function(arr){
    return arr[rand(arr.length-1)];
  };

  function randStatus() {
    var status = 0;
    /*
    var statusesMap = {
       1: 'started',
       2: 'checking',
       4: 'startaftercheck',
       8: 'checked',
       16: 'error',
       32: 'paused',
       64: 'queued',
       128: 'loaded'
    };
    */

    if (rand(10)<10) {
      status += 128; //loaded
      status += 8; //checked

      if (rand(10)<5) {
        status += 1; //started
        status += 64; //queued
      } else {
        status += 64; //queued
      }
    } else {
      status += 16; //error
    }
    return status;
  }

  var mock = {
    build: 25302,
    labels: [],
    torrents: [],
    torrentc: "0123456789",
    htmlToken: '<html><div id=\'token\' style=\'display:none;\'>MOCKEDTOKEN</div></html>'
  };

  $httpBackend.whenGET(new RegExp('/gui/token.html.*')).respond(function(method, url, data) {
    $log.info('mocking token.html');
    return [200, mock.htmlToken, {}];
  });

  $httpBackend.whenGET(new RegExp('/gui/.*[?&]action=getfiles&*.*')).respond(function(method, url, data) {
    $log.info('mocking action=getfiles');
    var i;
    var files = [];
    for (i=0; i<rand(100); i++) {
      var name = ipsumService.words(rand(15)+5);
      var size = rand(1000000000);
      var remaining = Math.random()*size;
      var priority = rand(3);
      files.push([name,size,remaining,priority]);
    }
    return [200, angular.toJson({
      build: mock.build,
      files: ["UNUSEDHASH", files]
      }), {}];
  });

  $httpBackend.whenGET(new RegExp('/gui/.*[?&]action=getsettings&*.*')).respond(function(method, url, data) {
    $log.info('mocking action=getsettings');
    return [200, angular.toJson({
      build: mock.build,
      settings: []
      }), {}];
  });

  $httpBackend.whenGET(new RegExp('/gui/.*[?&]list=1&*.*')).respond(function(method, url, data) {
    $log.info('mocking list=1');
    var i,j;
    var res = {};
    if (mock.torrents.length == 0) {
      //first call
      mock.labels = [];
      mock.torrents = [];
      for (i=0; i<rand(10) + 3; i++) {
        mock.labels.push([ipsumService.words(rand(5)),0]);
      }

      /**
      hash (string),
      status* (integer),
      name (string),
      size (integer in bytes),
      percent progress (integer in per mils),
      downloaded (integer in bytes),
      uploaded (integer in bytes),
      ratio (integer in per mils),
      upload speed (integer in bytes per second),
      download speed (integer in bytes per second),
      eta (integer in seconds),
      label (string),
      peers connected (integer),
      peers in swarm (integer),
      seeds connected (integer),
      seeds in swarm (integer),
      availability (integer in 1/65535ths),
      torrent queue order (integer),
      remaining (integer in bytes)
      */

      for (i=0; i<rand(2500) + 2500; i++) {
        var percent = rand(1000);
        var size = rand(1000000000)+500000;
        var remaining = size - size * percent / 1000;
        var name = ipsumService.words(rand(10)+5);
        var seeds = rand(100);
        var peers = rand(1000);
        var status = randStatus();
        var upspeed = 0;
        var downspeed = 0;
        var label = randInArr(mock.labels);
        label[1]++;

        if ((status % 2) === 1) {
          upspeed = rand(100000);
          downspeed = rand(100000);
        }
        if (rand(5)>4) {
          name = $window.L33t.Translate(name);
        }
        mock.torrents.push(
          [i,status,name,size,percent,rand(size),rand(size*2),Math.random(),upspeed,downspeed,0,label[0],rand(peers),peers,rand(seeds),seeds,rand(65535),i,remaining]
          );
      }
      return [200, angular.toJson({
        build: mock.build,
        label: mock.labels,
        torrents: mock.torrents,
        torrentc: mock.torrentc
        }), {}];
    } else {
      return [200, angular.toJson({
        build: mock.build,
        label: mock.labels,
        torrents: mock.torrents,
        torrentc: mock.torrentc
      }), {}];
    }
  });

  // $httpBackend.whenGET(new RegExp('/gui/token.html.*')).respond(function(method, url, data) {
  //   return [200, '<html><div id=\'token\' style=\'display:none;\'>MOCKEDTOKEN</div></html>', {}];
  // });


  var mockResponse = function(type) {

  }

  // Respond with 404 for all other service calls
  $httpBackend.whenGET(new RegExp('/gui/.*')).respond(function(method, url, data) {
    console.log(method,url,data);
    return 404;
  });
});
