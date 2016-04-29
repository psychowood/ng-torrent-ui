'use strict';

/**
 * @ngdoc function
 * @name ngTorrentUiApp.controller:DetailsDialogCtrl
 * @description
 * # DetailsDialogCtrl
 * Controller of the ngTorrentUiApp
 */
angular.module('ngTorrentUiApp')
    .controller('DetailsDialogCtrl', ['$scope', 'torrent', 'torrentServerService', 'toastr', '$translate', '$window', function($scope, torrent, torrentServerService, toastr, $translate, $window) {
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
        $scope.selectCheckbox = false;
        $scope.forceSelection = function(sel,filteredFiles) {
            var i;
            $scope.hasSelection = sel;
            filteredFiles = filteredFiles || $scope.torrent.files;
            for (i = 0; i < filteredFiles.length; i++) {
                filteredFiles[i].selected = sel;
            }
        };
        
        $scope.toggleSelection = function(file) {
            $scope.hasSelection = true;
            var i;
            for (i = 0; i < torrent.files.length; i++) {
                torrent.files[i].selected = (torrent.files[i] === file);
            }

        };

        $scope.setPriority = function(priorityToSet) {
            var i;
            var fileIndexes = [];
            for (i = 0; i < torrent.files.length; i++) {
                if (torrent.files[i].selected === true) {
                    fileIndexes.push(torrent.files[i].hash);
                }
            }
            torrentServerService.filePriority().set({
                hash: torrent.hash,
                priority: priorityToSet,
                f: fileIndexes
            }).$promise.then(function() {
                toastr.info('Priority changed succesfully', null, {
                    timeOut: 1000
                });
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
        
    }]);