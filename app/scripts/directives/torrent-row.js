'use strict';

/**
* @ngdoc directive
* @name utorrentNgwebuiApp.directive:torrentStatus
* @description
* # torrentStatus
*/
angular.module('utorrentNgwebuiApp')
.directive('torrentRow', function () {
  return {
    priority: 1000,
    templateUrl: 'views/torrent-row.html',
    restrict: 'E',
    replace: true,
    link: function postLink(scope /*, element, attrs */) {

      var item = scope.item;
      //Preserve order of execution

      var statusClass,statusTitle,statusColor;
      var btnClass,btnIcon,btnAction;

      item.getStatuses();

      if(item.isStatusError() && !item.isStatusCompleted()) {
        statusClass = 'exclamation-sign';
        statusTitle = 'Error';
        statusColor = 'text-danger';
      } else if(!item.isStatusLoaded()) {
        statusClass = 'warning-sign';
        statusTitle = 'Torrent not loaded';
        statusColor = 'text-danger';
      } else if(item.isStatusChecking()) {
        statusClass = 'repeat';
        statusTitle = 'Checking';
        statusColor = 'text-info';
      } else if(!item.isStatusChecked()) {
        statusClass = 'warning-sign';
        statusTitle = 'Torrent needs checking';
        statusColor = 'text-warning';
      } else if(item.isStatusPaused()) {
        statusClass = 'pause';
        statusTitle = 'Paused';
        statusColor = 'text-info';
      } else if(item.isStatusSeeding()) {
        statusClass = 'collapse-up';
        statusTitle = 'Seeding';
        statusColor = 'text-success';
      } else if(item.isStatusDownloading()) {
        statusClass = 'collapse-down';
        statusTitle = 'Downloading';
        statusColor = 'text-info';
        btnClass = 'warning';
        btnIcon = 'pause';
        btnAction = 'pause';
      } else if(item.isStatusStartAfterCheck()) {
        statusClass = 'repeat';
        statusTitle = 'Start after checking';
        statusColor = 'text-info';
      } else if(item.isStatusQueued()) {
        statusClass = 'time';
        statusTitle = 'Queued';
        statusColor = 'text-info';
      } else if(item.isStatusLoaded() && item.isStatusChecked()) {
        if (item.isStatusCompleted()) {
          statusClass = 'check';
          statusTitle = 'Completed';
          statusColor = 'text-success';
          btnClass = '';
          btnIcon = 'stop';
          btnAction = 'stop';
        } else {
          statusClass = 'unchecked';
          statusTitle = 'Ready';
          statusColor = '';
          btnClass = 'success';
          btnIcon = 'play-circle';
          btnAction = 'start';
        }
      } else {
        statusClass = 'question-sign';
        statusTitle = 'Status not supported: ' + parseInt(item.status).toString(2);
      }

      scope.statusClass = 'glyphicon-' + statusClass;
      scope.statusTitle = statusTitle;
      scope.statusColor = statusColor;
      scope.btnClass = 'btn-' + btnClass;
      scope.btnIcon = 'glyphicon-' + btnIcon;

    }
  };

});
