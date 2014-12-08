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
      if (item) {
        //Order of execution

        //var statuses = item.getStatuses();

        var statusClass,statusTitle,statusColor;
        var btnClass,btnIcon,btnAction;

        if(item.isStatusError() && !item.isStatusCompleted()) {
          statusClass = 'exclamation-sign';
          statusTitle = 'Error';
          statusColor = 'text-danger';
        } else if(!item.isStatusLoaded()) {
          statusClass = 'warning-sign';
          statusTitle = 'Torrent not loaded';
          statusColor = 'text-danger';
        } else if(!item.isStatusChecked()) {
          statusClass = 'warning-sign';
          statusTitle = 'Torrent needs checking';
          statusColor = 'text-warning';
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
        } else if(item.isStatusChecking()) {
          statusClass = 'repeat';
          statusTitle = 'Checking';
          statusColor = 'text-info';
        } else if(item.isStatusStartAfterCheck()) {
          statusClass = 'repeat';
          statusTitle = 'Start after checking';
          statusColor = 'text-info';
        } else if(item.isStatusPaused()) {
          statusClass = 'pause';
          statusTitle = 'Paused';
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
        scope.$doDefaultAction = function() {

        };

        item.getStatuses();
      } else {
        console.log('undefined');
      }
      //$compile(element)(scope);
    }
  };

  /*

  <span class="input-group-addon">
  <input type="checkbox" ng-model="item.selected" ng-change="updateSelected()">
  </span>
  <span class="input-group-addon queue" >
  {{item.getQueueStr()}}
  </span>
  <span class="input-group-addon status">
  <torrent-status ng-model="item" />
  </span>
  <input readonly type="text" title="{{item.name}}" class="form-control selectable name" ng-click="setSelected(item.hash)"  ng-value="item.decodedName" />
  <div class="input-group-addon selectable size">
  <span class="byte-value">{{item.getSizeStrArr()[0]}}</span> <span class="byte-uom">{{item.getSizeStrArr()[1]}}</span><div class="download-progress" ng-style="{'width':item.getPercentStr()}" ng-class="{'btn-warning':(item.percent < 250), 'btn-info':(item.percent < 999), 'btn-success':(item.percent > 999)}"></div></div>

  <span class="input-group-addon selectable speed hide-on-small">
  <span class="byte-value">{{item.getUpSpeedStrArr()[0]}}</span> <span class="byte-uom">{{item.getUpSpeedStrArr()[1]}}</span>
  -
  <span class="byte-value">{{item.getDownSpeedStrArr()[0]}}</span> <span class="byte-uom">{{item.getDownSpeedStrArr()[1]}}</span>
  </span>
  <span class="input-group-btn hide-on-small">
  <button class="btn" ng-class="!item.isStatusStarted() ? 'btn-success' : 'btn-warning'" ng-click="doAction('start',item)">
  <span class="glyphicon" ng-class="!item.isStatusStarted() ? 'glyphicon-play-circle' : 'glyphicon-pause'"></span>
  </button>
  <button class="btn btn-danger hide-on-small" >
  <span class="glyphicon" ng-class="item.isStatusStarted() ? 'glyphicon-stop' : 'glyphicon-remove-sign'"></span>
  </button>
  </span>

  <span class="glyphicon" ng-class="
  {
  'glyphicon-download': item.isStatusDownloading(),
  'glyphicon-refresh': item.isStatusChecking(),
  '': item.isStatusStartAfterCheck(),
  '': item.isStatusChecked(),
  'glyphicon-exclamation-sign': item.isStatusError(),
  '': item.isStatusPaused(),
  '': item.isStatusQueued(),
  '': item.isStatusLoaded(),
  'glyphicon-ok-sign': item.isStatusCompleted(),
  'glyphicon-upload': item.isStatusSeeding()
}
">

*/
});
