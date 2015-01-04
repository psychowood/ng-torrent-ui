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
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ui.bootstrap',
  'vs-repeat',
  'toastr',
  'angularFileUpload'
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
  .controller('NavController', function($scope,uTorrentService){
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

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
