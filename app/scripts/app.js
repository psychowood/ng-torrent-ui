'use strict';

/**
 * @ngdoc overview
 * @name utorrentNgwebuiApp
 * @description
 * # utorrentNgwebuiApp
 *
 * Main module of the application.
 */
 angular
 .module('utorrentNgwebuiApp', [
  'templates-views',
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ui.bootstrap',
  'vs-repeat',
  'toastr',
  'angularFileUpload',
  'pascalprecht.translate'
  ]).config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'TorrentsCtrl'
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl'
    })
    .when('/settings', {
      templateUrl: 'views/settings.html',
      controller: 'SettingsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  })
  .config(function ($translateProvider) {
    $translateProvider
      .useLoader('translationsLoader')
      .fallbackLanguage('en')
      .determinePreferredLanguage();
  })
/*
  .directive('resizable', function($window) {
        return function($scope) {

        // On window resize => resize the app
        $scope.initializeWindowSize = function() {
            $scope.windowHeight = $window.innerHeight;
            $scope.windowWidth = $window.innerWidth;
        };

        angular.element($window).bind('resize', function() {
            $scope.initializeWindowSize();
            $scope.$apply();
        });

        // Initiate the resize function default values
        $scope.initializeWindowSize();
    };
  })
*/
  .controller('NavController', function($scope,uTorrentService,$http,$cookies,$log,$translate,translationsLoader){

    translationsLoader('getoptions').then(function(options) {
      var langId,lang;
      var sortable = [];
      for (lang in options.languages) {
            sortable.push({id:lang, desc:options.languages[lang]});
      }
      sortable.sort(function(a, b) {
        return ( ( a.desc === b.desc ) ? 0 : ( ( a.desc > b.desc ) ? 1 : -1 ) );
      });

      $scope.languages = sortable;

      langId = $cookies.language;
      if (langId) {
        $translate.use(langId);
      } else {
        langId =  $translate.preferredLanguage().split('_')[0];
        $translate.use(langId);
      }

      $scope.languageDesc = options.languages[langId];

      $scope.changeLanguage = function (lang) {
        if (lang.id !== $translate.use()) {
          $translate.use(lang.id);
          $scope.languageDesc = lang.desc;
          $cookies.language = lang.id;
        }
      };
    });

    $scope.alerts = [];
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
    var lastUpdateCheck = $cookies.lastUpdateCheck;
    var now = new Date().getTime();
    if (lastUpdateCheck === undefined || (now - lastUpdateCheck) > 36000000) {

      $http({
        method: 'GET',
        url: 'https://api.github.com/repos/psychowood/ng-torrent-ui/releases?per_page=1',
        headers: {
         'Accept': 'application/vnd.github.v3+json'
        }
      }).then(function(response) {
        $cookies.lastUpdateCheck = now;
        if (response.data && response.data.length > 0) {
          var data = response.data[0];
          var versionAttr = 'tag_name';
          var latest = data[versionAttr];

          $http.get('bower.json').then(function(res) {
            var currentVersion = 'v' + res.data.version;
            $cookies.currentVersion = currentVersion;
            if (latest !== currentVersion) {
              if ($cookies.updatedVersion !== latest) {
                $scope.alerts.push({ type: 'info', msg: 'New version available: ' + latest });
                $cookies.updatedVersion = latest;
              }
            } else {
              delete $cookies.updatedVersion;
            }
          });

        } else {
          $log.warning('can\'t check latest release');
        }

      });
    } else {
      $log.info('Version already checked in the last hour');
    }
    $scope.currentVersion = $cookies.currentVersion;
    $scope.updatedVersion = $cookies.updatedVersion;

    uTorrentService.init().then(function() {
      var ts = uTorrentService.actions().getsettings();
      ts.$promise.then(function() {
        $scope.serverVersion = uTorrentService.getVersion();
      });
      return ts;
    }, function() {
      $scope.alerts.push({ type: 'danger', msg: 'Service unavailable' });
    });
  })
  .directive('focusMe', function ($timeout) {
  return {
    priority: 1,
    link: function (scope, element /* , attrs */) {
      $timeout(function () {
        element[0].focus();
      },250);
    }
  };
});
