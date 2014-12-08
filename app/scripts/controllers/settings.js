'use strict';

/**
 * @ngdoc function
 * @name utorrentNgwebuiApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the utorrentNgwebuiApp
 */
 angular.module('utorrentNgwebuiApp')
 .controller('SettingsCtrl', function ($scope,uTorrentService) {
 	$scope.signIn = function() {
 		uTorrentService.conf.url = $scope.url;
 		uTorrentService.conf.user = $scope.user;
 		uTorrentService.conf.password = $scope.password;

 		uTorrentService.getToken(); 	
 	};
 });
