'use strict';

/**
 * @ngdoc function
 * @name ngTorrentUiApp.controller:DetailsDialogCtrl
 * @description
 * # DetailsDialogCtrl
 * Controller of the ngTorrentUiApp
 */
angular.module('ngTorrentUiApp')
    .controller('DetailsDialogCtrl', function($scope, torrent, uTorrentService, toastr, $translate, $window) {
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
            for (i = 0; i < torrent.files.length; i++) {
                if (torrent.files[i].selected === true) {
                    $scope.hasSelection = true;
                    return;
                }
            }
            $scope.hasSelection = false;
        };
        $scope.toggleSelection = function(file) {
            $scope.hasSelection = true;
            var i;
            if (file) {
                for (i = 0; i < torrent.files.length; i++) {
                    torrent.files[i].selected = (torrent.files[i] === file);
                }
            } else {
                var sel = ($scope.selectCheckbox === true);
                $scope.hasSelection = sel;
                for (i = 0; i < $scope.filteredFiles.length; i++) {
                    $scope.filteredFiles[i].selected = sel;
                }
            }
        };

        $scope.setPriority = function() {
            var i;
            var fileIndexes = [];
            for (i = 0; i < torrent.files.length; i++) {
                if (torrent.files[i].selected === true) {
                    fileIndexes.push(torrent.files[i].hash);
                }
            }
            uTorrentService.filePriority().set({
                hash: torrent.hash,
                priority: $scope.priorityToSet,
                f: fileIndexes
            }).$promise.then(function() {
                toastr.info('Priority changed succesfully', null, {
                    timeOut: 1000
                });
                $scope.priorityToSet = '';
            });
        };
        
        $translate('SHARE_MAGNET_PAGE').then(function (translation) {
            $scope.socialshareUrl = translation + torrent.hash;
        });
        $translate('SHARE_PREFIX_TEXT').then(function (translation) {
            $scope.socialshareText = translation;
            $scope.socialshareTextWithName = translation + ' - ' + torrent.name;
        });
        $translate('NTU_HOME').then(function (home) {
            $scope.socialshareMedia = home + '/raw/master/app/logo.png?raw=true';
            $scope.socialshareSource = home;
            
            $scope.shareViaEmail = function() {
                $translate('SHARED_VIA').then(function (via) {

                var body = $window.encodeURIComponent(torrent.name) +
                        '%0A' +
                        '%0A' +
                        torrent.getMagnetURI() +
                        '%0A' +
                        '%0A' +
                        '------------------------' +
                        '%0A' +
                        via + 
                        $scope.socialshareSource;

                $window.location = 'mailto:?' + 
                    'subject=' + $scope.socialshareText + 
                    '&body=' + body;
            });
            };
        });
        
    });