'use strict';

/**
 * @ngdoc function
 * @name utorrentNgwebuiApp.controller:DetailsDialogCtrl
 * @description
 * # DetailsDialogCtrl
 * Controller of the utorrentNgwebuiApp
 */
angular.module('utorrentNgwebuiApp')
  .controller('DetailsDialogCtrl', function ($scope, $modalInstance, torrent, uTorrentService, toastr) {
    $scope.hasSelection = false;

      $scope.filters = {
        name: ''
      };

      $scope.sorter = {
        field: 'name',
        descending: false
      };

      $scope.torrent = torrent;
      $scope.filteredFiles = torrent.files;

      $scope.checkSelected = function() {
        var i;
        for (i=0;i<torrent.files.length; i++) {
          if (torrent.files[i].selected === true) {
            $scope.hasSelection = true;
            return;
          }
        }
        $scope.hasSelection = false;
      };
      $scope.toggleSelection = function(file){
        $scope.hasSelection = true;
        var i;
        if (file) {
          for (i=0;i<torrent.files.length; i++) {
            torrent.files[i].selected = (torrent.files[i] === file);
          }
        } else {
          var sel = ($scope.selectCheckbox === true);
          $scope.hasSelection = sel;
          for (i=0;i<$scope.filteredFiles.length; i++) {
            $scope.filteredFiles[i].selected = sel;
          }
        }
      };

      $scope.setPriority = function() {
        var i;
        var fileIndexes = [];
        for (i=0;i<torrent.files.length; i++) {
          if (torrent.files[i].selected === true) {
              fileIndexes.push(torrent.files[i].hash);
          }
        }
        uTorrentService.filePriority().set({
          hash: torrent.hash, priority:$scope.priorityToSet, f:fileIndexes
        }).$promise.then(function() {
          toastr.info('Priority changed succesfully',null,{timeOut: 1000});
          $scope.priorityToSet = '';
    		});
      };
  });
