'use strict';

/**
 * @ngdoc function
 * @name utorrentNgwebuiApp.controller:DetailsDialogCtrl
 * @description
 * # DetailsDialogCtrl
 * Controller of the utorrentNgwebuiApp
 */
angular.module('utorrentNgwebuiApp')
  .controller('DetailsDialogCtrl', function ($scope, $modalInstance, torrent) {
      $scope.torrent = torrent;
  });
