'use strict';

/**
 * @ngdoc function
 * @name ngTorrentUiApp.controller:IssueReporterCtrl
 * @description
 * # IssueReporterCtrl
 * Controller of the ngTorrentUiApp
 */
angular.module('utorrentNgwebuiApp')
  .controller('IssueReporterCtrl', function ($scope,uTorrentService,$window) {
    var version = 'undefined';
    var newIssueBaseUrl = 'https://github.com/psychowood/ng-torrent-ui/issues/new/';
    $scope.newIssueUrl = newIssueBaseUrl;
    // uTorrentService.init().then(function(){
    // });

    $scope.prepareReport = function() {
      version = uTorrentService.getVersion();
      $scope.newIssueUrl = newIssueBaseUrl + '?body=%0A%0A' + $window.encodeURIComponent('**'+version + '**');
      return true;
    };
  });
