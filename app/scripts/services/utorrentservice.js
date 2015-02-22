'use strict';

/**
 * @ngdoc service
 * @name utorrentNgwebuiApp.uTorrentService
 * @description
 * # uTorrentService
 * Factory in the utorrentNgwebuiApp.
 */
 angular.module('utorrentNgwebuiApp')
 .factory('Torrent', function ($window,$log) {

    /**
    hash (string),
    status* (integer),
    name (string),
    size (integer in bytes),
    percent progress (integer in per mils),
    downloaded (integer in bytes),
    upload-speeded (integer in bytes),
    ratio (integer in per mils),
    upload-speed speed (integer in bytes per second),
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

  /**
   * Constructor, with class name
   */
   function Torrent(hash,
    status,
    name,
    size,
    percent,
    downloaded,
    uploaded,
    ratio,
    uploadSpeed,
    downloadSpeed,
    eta,
    label,
    peersConnected,
    peersInSwarm,
    seedsConnected,
    seedsInSwarm,
    availability,
    torrentQueueOrder,
    remaining,
    additionalData,
    decodedName) {

    this.selected = false;

    this.hash = hash;
    this.status = status;
    this.name = name;
    this.size = size;
    this.percent = percent;
    this.downloaded = downloaded;
    this.uploaded = uploaded;
    this.ratio = ratio;
    this.uploadSpeed = uploadSpeed;
    this.downloadSpeed = downloadSpeed;
    this.eta = eta;
    this.label = label;
    this.peersConnected = peersConnected;
    this.peersInSwarm = peersInSwarm;
    this.seedsConnected = seedsConnected;
    this.seedsInSwarm = seedsInSwarm;
    this.availability = availability;
    this.torrentQueueOrder = torrentQueueOrder;
    this.remaining = remaining;
    this.additionalData = additionalData;
    if (decodedName) {
      this.decodedName = decodedName;
    } else {
      this.decodedName = this.name;
    }
    this.getStatuses();
  }


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
 var statusesFlags = [1,2,4,8,16,32,64,128].reverse();

 Torrent.prototype.getMagnetURI = function() {
   return 'magnet:?xt=urn:btih:' + this.hash + '&dn=' + encodeURIComponent(this.name);
 };

 Torrent.prototype.getStatusFlag = function (x) {
  /*jshint bitwise: false*/
  return (this.status & x) === x;
  /*jshint bitwise: true*/
};

Torrent.prototype.getStatuses = function () {
  //var str = '';
  var i = 0;

  if (this.statusesCached) {
    return this.statusesCached;
  }
  var res = [];

  for (i=0; i<statusesFlags.length; i++) {
    if (this.getStatusFlag(statusesFlags[i])) {
      res.push(statusesMap[statusesFlags[i]]);
    }
  }
  if (this.status > 255) {
    res.push('unknown');
    $log.warn('unknown status: ' + this.status);
  }

  if (this.percent === 1000) {
    res.push('completed');
  }

  this.statusesCached = res;

  return this.statusesCached;
};

Torrent.prototype.isStatusStarted = function () {
  return this.getStatusFlag(1);
};
Torrent.prototype.isStatusChecking = function () {
  return this.getStatusFlag(2);
};
Torrent.prototype.isStatusStartAfterCheck = function () {
  return this.getStatusFlag(4);
};
Torrent.prototype.isStatusChecked = function () {
  return this.getStatusFlag(8);
};
Torrent.prototype.isStatusError = function () {
  return this.getStatusFlag(16);
};
Torrent.prototype.isStatusPaused = function () {
  return this.getStatusFlag(32);
};
Torrent.prototype.isStatusQueued = function () {
  return this.getStatusFlag(64) && !this.isStatusDownloading();
};
Torrent.prototype.isStatusLoaded = function () {
  return this.getStatusFlag(128);
};
Torrent.prototype.isStatusCompleted = function () {
  return (this.percent === 1000) ;
};
Torrent.prototype.isStatusDownloading = function () {
  return this.isStatusStarted() && (!this.isStatusCompleted()) ;
};
Torrent.prototype.isStatusSeeding = function () {
  return this.isStatusStarted() && (this.isStatusCompleted()) ;
};

Torrent.prototype.getQueueStr = function () {
  if (this.torrentQueueOrder === -1) {
    return '*';
  }
  return this.torrentQueueOrder;
};

Torrent.prototype.getPercentStr = function () {
  return (this.percent/10).toFixed(0) + '%';
};

Torrent.prototype.getData = function () {
  return this.additionalData;
};

var formatBytesCache = {};
function formatBytes(bytes) {
  if (formatBytesCache[bytes]) {
    return formatBytesCache[bytes];
  }
  var val;
  var uom;

  if (bytes < 1024) {
    val = bytes;
    uom = 'B';
  } else if (bytes < 1048576) {
    val = (bytes/1024).toFixed(1);
    uom = 'KB';
  } else if (bytes < 1073741824) {
    val = (bytes/1048576).toFixed(1);
    uom = 'MB';
    } else {
      val = (bytes/1073741824).toFixed(1);
      uom = 'GB';
    }
    return [val, uom];
  }

Torrent.prototype.formatBytesStrArr = function(bytes) {
  return formatBytes(bytes);
};

Torrent.prototype.formatBytes = function(bytes) {
  return formatBytes(bytes).join('');
};

  Torrent.prototype.getDownloadedStrArr = function () {
    if (!this.downloadedStrArr) {
      this.downloadedStrArr = formatBytes(this.downloaded);
    }
    return this.downloadedStrArr;
  };

  Torrent.prototype.getUploadedStrArr = function () {
    if (!this.uploadedStrArr) {
      this.uploadedStrArr = formatBytes(this.uploaded);
    }
    return this.uploadedStrArr;
  };

  Torrent.prototype.getSizeStrArr = function () {
    if (!this.sizeStrArr) {
      this.sizeStrArr = formatBytes(this.size);
    }
    return this.sizeStrArr;
  };

  Torrent.prototype.getUpSpeedStrArr = function () {
    if (!this.upSpeedStrArr) {
      var res = formatBytes(this.uploadSpeed);
      res[1] = res[1] + '/s';
      this.upSpeedStrArr = res;
    }
    return this.upSpeedStrArr;
  };

  Torrent.prototype.getDownSpeedStrArr = function () {
    if (!this.downSpeedStrArr) {
      var res = formatBytes(this.downloadSpeed);
      res[1] = res[1] + '/s';
      this.downSpeedStrArr = res;
    }
    return this.downSpeedStrArr;
  };

  Torrent.prototype.getLabels = function () {
    if (typeof this.label === 'string') {
      return [this.label];
    } else {
      return this.label;
    }
  };

  Torrent.prototype.getMainLabel = function() {
    var labels = this.getLabels();
    if (labels && labels.length > 0){
      return labels[0];
    } else {
      return '';
    }
  };

  /**
   * Static method, assigned to class
   * Instance ('this') is not available in static context
   */
   Torrent.build = function (array,additionalData,decodedName) {
    return new Torrent(
      array[0],
      array[1],
      array[2],
      array[3],
      array[4],
      array[5],
      array[6],
      array[7],
      array[8],
      array[9],
      array[10],
      array[11],
      array[12],
      array[13],
      array[14],
      array[15],
      array[16],
      array[17],
      array[18],
      additionalData,
      decodedName
      );
  };

  /**
   * Return the constructor function
   */
   return Torrent;
 })
.service('uTorrentService', function ($http,$resource,$log,$upload,$q) {

  var loading = null;
  var data = {
    url: '/gui/',
    password: null,
    token: null,
    cid: 0,
    build: -1
  };

  var updateCidInterceptor = {
    response: function (response) {
      data.cid = response.data.torrentc;
    },
    responseError: function (response) {
      console.log('error in interceptor', data, arguments, response);
    }
  };

  var uTorrentService = {
    cacheMap: {},
    conf: data,
    init: function() {
      if (data.token) {
        $log.info('token already cached');
        loading.resolve(data.token);
        return loading.promise;
      }

      if (loading !== null) {
        $log.info('token load in progress. Deferring callback');
        return loading.promise;
      } else {
        loading = $q.defer();
      }

      $log.info('get token');
      $http.get(data.url + 'token.html?t=' + Date.now(), {timeout:5000}).
      success(function(str) {
        var match = str.match(/>([^<]+)</);
        if (match) {
          data.token = match[match.length - 1];
          loading.resolve(data.token);
          $log.info('got token ' + data.token);
        }
      }).error(function() {
        loading.reject('Error loading token');
        $log.error(arguments);
      });
      return loading.promise;
    },
    addTorrentUrl: function(url,dir,path){
      return $resource(data.url + '.' + '?token=:token&action=add-url&s=:url&download_dir=:dir&path=:path&t=:t', {token:data.token,t:Date.now(),url: url, dir: dir, path: path}).get().$promise;

    },
    uploadTorrent: function(file,dir,path) {
        return $upload.upload({
          url: data.url + '?token=' + data.token + '&action=add-file&download_dir=' + encodeURIComponent(dir) + '&path=' + encodeURIComponent(path),
          method: 'POST',
          file: file, // single file or a list of files. list is only for html5
          //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
          fileFormDataName: 'torrent_file', // file formData name ('Content-Disposition'), server side request form name
                                      // could be a list of names for multiple files (html5). Default is 'file'
          //formDataAppender: function(formData, key, val){}  // customize how data is added to the formData.
                                                              // See #40#issuecomment-28612000 for sample code
        });
    },
    torrents: function(){
      return $resource(data.url + '.' + '?:action:data&token=:token&cid=:cid:opt&t=:t', {token:data.token,cid:data.cid,t:Date.now()}, {
        list: {
          method:'GET',
          params: { action:'list=1'},
          interceptor: updateCidInterceptor,
          isArray:false
        }
      });
    },
    actions: function(){
      return $resource(data.url + '.' + '?action=:action&token=:token&t=:t', {token:data.token,cid:data.cid,t:Date.now()}, {
        start: {
          params: { action:'start'}
        },
        stop: {
          params: { action:'stop'}
        },
        pause: {
          params: { action:'pause'}
        },
        remove: {
          params: { action:'remove'}
        },
        removedata: {
          params: { action:'removedata'}
        },
        removetorrent: {
          params: { action:'removetorrent'}
        },
        removedatatorrent: {
          params: { action:'removedatatorrent'}
        },
        forcestart: {
          params: { action:'forcestart'}
        },
        recheck: {
          params: { action:'recheck'}
        },
        queueup: {
          params: { action:'queueup'}
        },
        queuedown: {
          params: { action:'queuedown'}
        },
        getprops: {
          params: { action:'getprops'}
        },
        getfiles: {
          params: { action:'getfiles'},
          transformResponse: function (response) {
              var i,file;
              var fileArr = angular.fromJson(response).files[1];
              var files = [];
              for (i=0; i<fileArr.length; i++) {
                file = fileArr[i];
                files.push({
                  hash: i,
                  name: file[0],
                  size: file[1],
                  percent: (file[2]/file[1]*100).toFixed(2),
                  priority: file[3]
                });
              }
              return {files:files};
            }
        },
        getsettings: {
          params: { action:'getsettings'},
          isArray: true,
          transformResponse: function (response) {
              var responseData = angular.fromJson(response);
              data.build = responseData.build;
              responseData = responseData.settings;
              var settings = [];
              var i,val;
              var types = ['int','bool','string'];
              for (i=0; i<responseData.length; i++) {
                val = {
                  name: responseData[i][0],
                  type: types[responseData[i][1]],
                  value: responseData[i][2],
                  others: (responseData[i].length > 2)?responseData[i][3]:undefined
                };
                settings.push(val);
              }
              uTorrentService.settings = settings;
              if (parseInt(data.build) < 25406) { //Features supported from uTorrent 3+
                delete uTorrentService.getDownloadDirectories;
              }
              return settings;
            }
        }
      });
    },
    setLabel: function(hashes,label){
      var encodedQuery = '';
      var i;
      for (i=0; i<hashes.length; i++) {
        encodedQuery += '&' + ['hash='+hashes[i],'s=label','v=' + encodeURIComponent(label)].join('&');
      }
      return $http.get(data.url + '?token=' + data.token + '&action=setprops' + encodedQuery, {
        params: {
          t:Date.now()
        }
      });
    },
    getDownloadDirectories: function(){
      return $resource(data.url + '.' + '?token=:token&action=list-dirs&t=:t', {token:data.token,t:Date.now()}, {
        get: {
          isArray: true,
          transformResponse: function (response) {
            var responseData = angular.fromJson(response);
            return responseData['download-dirs'];
          }
        }
      }).get().$promise;
    },
    filePriority: function(){
      return $resource(data.url + '.' + '?token=:token&action=setprio&hash=:hash&t=:t&p=:priority', {token:data.token,t:Date.now()}, {
        set: {
          method: 'GET'
        }
      });
    },
    getVersion: function() {
      var buildVersionStr = function() {
        var prefix = 'μTorrent';
        var preBuild = 'build';
        return [prefix,preBuild,data.build].join(' ');
      };

      if (data.build === -1) {
        return '';
      }
      return buildVersionStr();

    }
  };
  return uTorrentService;
});
