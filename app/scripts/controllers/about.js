'use strict';

/**
 * @ngdoc function
 * @name utorrentNgwebuiApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the utorrentNgwebuiApp
 */
 angular.module('utorrentNgwebuiApp')
 .controller('AboutCtrl', function ($scope,uTorrentService) {
 	$scope.url = uTorrentService.url;
 });
