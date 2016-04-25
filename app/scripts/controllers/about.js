'use strict';

/**
 * @ngdoc function
 * @name ngTorrentUiApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ngTorrentUiApp
 */
 angular.module('ngTorrentUiApp')
 .controller('AboutCtrl', function ($scope,torrentServerService) {
 	$scope.url = torrentServerService.url;
 });
