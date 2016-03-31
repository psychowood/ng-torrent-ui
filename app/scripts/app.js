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
        'pascalprecht.translate',
        'ngTagsInput',
        'angularMoment'
    ]).config(function($routeProvider) {
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
    .config(function($translateProvider, $cookiesProvider) {
        $translateProvider
            .determinePreferredLanguage()
            .useLoader('translationsLoader')
            .fallbackLanguage('en');
        var now = new Date();
        // this will set the expiration to 6 months
        var exp = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
        $cookiesProvider.defaults.expires = exp;
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
    .controller('NavController', function($scope, uTorrentService, $http, $cookies, $log, $translate, translationsLoader, $rootScope) {

        translationsLoader('getoptions').then(function(options) {
            var langId, lang;
            var sortable = [];
            for (lang in options.languages) {
                sortable.push({
                    id: lang,
                    desc: options.languages[lang]
                });
            }
            sortable.sort(function(a, b) {
                return ((a.desc === b.desc) ? 0 : ((a.desc > b.desc) ? 1 : -1));
            });

            $scope.languages = sortable;

            langId = $cookies.get('language');
            if (langId) {
                $translate.use(langId);
            } else {
                langId = $translate.preferredLanguage().split('_')[0];
                $translate.use(langId);
            }

            $scope.languageDesc = options.languages[langId];

            $scope.changeLanguage = function(lang) {
                if (lang.id !== $translate.use()) {
                    $translate.use(lang.id);
                    $scope.languageDesc = lang.desc;
                    $cookies.put('language', lang.id);
                }
            };
        });

        $scope.alerts = [];
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
        var lastUpdateCheck = $cookies.get('lastUpdateCheck');
        var now = new Date().getTime();

        var isNewVersion = function(installed, required) {
            var a, b, i;
            if (installed === required) {
                return false;
            }

            a = installed.replace('v', '').split('.');
            b = required.replace('v', '').split('.');

            for (i = 0; i < a.length; ++i) {
                a[i] = Number(a[i]);
            }
            for (i = 0; i < b.length; ++i) {
                b[i] = Number(b[i]);
            }
            if (a.length === 2) {
                a[2] = 0;
            }

            if (a[0] > b[0]) {
                return true;
            }
            if (a[0] < b[0]) {
                return false;
            }

            if (a[1] > b[1]) {
                return true;
            }
            if (a[1] < b[1]) {
                return false;
            }

            if (a[2] > b[2]) {
                return true;
            }
            if (a[2] < b[2]) {
                return false;
            }

            return true;
        };


        $http.get('bower.json').then(function(res) {
            var currentVersion = 'v' + res.data.version;
            if ($cookies.get('currentVersion') !== currentVersion) {
                lastUpdateCheck = undefined;
                $cookies.remove('updatedVersion');
                $cookies.remove('lastUpdateCheck');
                delete $scope.updatedVersion;
                delete $scope.lastUpdateCheck;
            }
            $cookies.put('currentVersion', currentVersion);
            $scope.currentVersion = $cookies.get('currentVersion');

            if (lastUpdateCheck === undefined || (now - lastUpdateCheck) > 36000000) {

                $http({
                    method: 'GET',
                    url: 'https://api.github.com/repos/psychowood/ng-torrent-ui/releases?per_page=1',
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }).then(function(response) {
                    $cookies.put('lastUpdateCheck', now);
                    if (response.data && response.data.length > 0) {
                        var data = response.data[0];
                        var versionAttr = 'tag_name';
                        var latest = data[versionAttr];

                        if (isNewVersion(currentVersion, latest)) {
                            if ($cookies.get('updatedVersion') !== latest) {
                                $scope.alerts.push({
                                    type: 'info',
                                    msg: 'New version available: ' + latest
                                });
                                $cookies.put('updatedVersion', latest);
                            }
                        } else {
                            $cookies.remove('updatedVersion');
                        }

                    } else {
                        $log.warning('can\'t check latest release');
                    }

                });
            } else {
                $log.info('Version already checked in the last hour');
            }

        });

        $scope.updatedVersion = $cookies.get('updatedVersion');

        uTorrentService.init().then(function() {
            var ts = uTorrentService.actions().getsettings();
            ts.$promise.then(function() {
                $rootScope.features = uTorrentService.supports;
                $rootScope.serverVersion = uTorrentService.getVersion();
            });
            return ts;
        }, function() {
            $scope.alerts.push({
                type: 'danger',
                msg: 'Service unavailable'
            });
        });
    })
    .directive('focusMe', function($timeout) {
        return {
            priority: 1,
            link: function(scope, element /* , attrs */ ) {
                $timeout(function() {
                    element[0].focus();
                }, 250);
            }
        };
    });