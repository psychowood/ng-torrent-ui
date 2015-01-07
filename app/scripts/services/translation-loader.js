'use strict';

/**
 * @ngdoc service
 * @name ngTorrentUiApp.translationLoader
 * @description
 * # translationLoader
 * Factory in the ngTorrentUiApp.
 */
angular.module('utorrentNgwebuiApp')
  .factory('translationsLoader', function ($http, $q) {
    var languages,constants;
    // var loading = false;

    return function (options) {
        var deferred = $q.defer();
        var isGetOptions = (options === 'getoptions');

        var load = function(opts) {
          if (isGetOptions) {
            return deferred.resolve({languages: languages, constants: constants});
          } else {
            $http.get(['langs/utorrent/',opts.key,'.js.json'].join('')).then(
              function(response) {
                var labels = response.data;
                var translations = {};
                angular.forEach(constants, function(value, key) {
                  if (labels[value]) {
                    translations[key] = labels[value];
                  } else {
                    translations[key] = 'UNDEFINED_' + key;
                  }

                }, translations);

                $http.get(['langs/',opts.key,'.json'].join('')).then(function(response) {
                  angular.extend(translations, response.data);
                  return deferred.resolve(translations);
                },function() {
                  //Ignore missing files
                  return deferred.resolve(translations);
                });

              },
              function(response) {
                console.log(response);
                deferred.reject(response);
              });
          }
        };

        if (languages && constants) {
          load(options);
        } else {
          // if (loading) {
          //   if (isGetOptions){
          //     return loading.promise;
          //   } else {
          //
          //   }
          // }
          // loading = $q.defer();

          $http.get('langs/utorrent/_.js').then(
            function(response) {
              var invertDefine = 'Array.prototype.invert = function() { var h = {}; for (var g = 0, f = this.length; g < f; ++g) { h[this[g]] = g } return h; };';
              /*jslint evil: true */
              var array = eval('\'use strict\';' + invertDefine + response.data + ';[LANG_CONST,LANG_LIST]');
              /*jslint evil: false */
              constants = array[0];
              languages = array[1];
              // loading.resolve({languages: languages, constants: constants});
              load(options);
            },
            function(response) {
              console.log(response);
            });
        }

        return deferred.promise;
    };
  });
