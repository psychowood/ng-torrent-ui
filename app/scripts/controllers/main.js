'use strict';

/**
 * @ngdoc function
 * @name utorrentNgwebuiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the utorrentNgwebuiApp
 */
 angular.module('utorrentNgwebuiApp')
 .controller('TorrentsCtrl', function ($scope,$window,$filter,$timeout,$log,uTorrentService,Torrent,toastr) {

   		$scope.headerHeight = 350;
        // On window resize => resize the app
        $scope.setListHeight = function() {
            $scope.listHeight = $window.innerHeight - 200;// - $scope.headerHeight;
        };

        angular.element($window).bind('resize', function() {
            $scope.setListHeight();
            $scope.$apply();
        });

        // Initiate the resize function default values
        $scope.setListHeight();

 	/*
 	{
		"build": BUILD NUMBER (integer),
		"label": [
		[
		LABEL (string),
		TORRENTS IN LABEL (integer)		],
		...
		],
		"torrents": [
		[
		HASH (string),
		STATUS* (integer),
		NAME (string),
		SIZE (integer in bytes),
		PERCENT PROGRESS (integer in per mils),
		DOWNLOADED (integer in bytes),
		UPLOADED (integer in bytes),
		RATIO (integer in per mils),
		UPLOAD SPEED (integer in bytes per second),
		DOWNLOAD SPEED (integer in bytes per second),
		ETA (integer in seconds),
		LABEL (string),
		PEERS CONNECTED (integer),
		PEERS IN SWARM (integer),
		SEEDS CONNECTED (integer),
		SEEDS IN SWARM (integer),
		AVAILABILITY (integer in 1/65535ths),
		TORRENT QUEUE ORDER (integer),
		REMAINING (integer in bytes)		],
		...
		],
		"torrentc": CACHE ID** (string integer)
	}
	*/

	$scope.labels = [];

	$scope.torrents = [];
	$scope.filteredtorrents = [];
	$scope.selectedtorrents = [];

	var torrentsMap = null;
	var reloadTimeout;
	$scope.autoreloadTimeout = 5000;

	$scope.newtorrent = '';

	function getSelected(torrentsArr) {
		var i;
		var sel = [];
		for (i =0; i<torrentsArr.length; i++) {
			if (torrentsArr[i].selected) {
				sel.push(torrentsArr[i]);
			}
		}
		return sel;
	}

	$scope.addTorrent = function() {
    // /gui/?token=KJHeg4Abwc-i-i2UHmZrAgIrNi36WIoa1yuGbocKSfeD7_ejwHl3ZrNqg1Q=&action=add-url&s=magnet%3A%3Fxt%3Durn%3Abtih%3ASNRDTJN77AU5COCRBKXQBWG5L77IGOYZ&t=1417898807570"
    // /gui/?token=jOEl8ys6LWcpDenYVCdoyJYTbFwwBs3a5yOxT5LQKCj49x3cdba88AZwg1Q=&action=add-url&s=magnet:%3Fxt=urn:btih:SNRDTJN77AU5COCRBKXQBWG5L77IGOYZ&t=1417900081345
    // /gui/?token=w3IwxidfdGblIuS4oiBN_lAszYIsMDlpEIQUKTQYa_CL5YcyPxqe-QNsg1Q=&action=add-url&s=magnet%253A%253Fxt%253Durn%253Abtih%253ASNRDTJN77AU5COCRBKXQBWG5L77IGOYZ&t=1417899044969
    //var url = encodeURIComponent($scope.newtorrent);
    var url = $scope.newtorrent;
		var ts = uTorrentService.torrent().add({data:url});
		ts.$promise.then(function() {
      toastr.info('Torrent added succesfully',null,{timeOut: 1000});
      $scope.newtorrent = '';
		});
	};

	function getSelectedHashes(item) {
		var hashes = [];
		if (!item) {
			angular.forEach($scope.selectedtorrents, function(value /* , key */) {
				hashes.push(value.hash);
			});
		} else {
			hashes.push(item.hash);
		}

		return hashes;
	}

	$scope.doAction = function(action,item) {
		var hashes = getSelectedHashes(item);

		var service = uTorrentService.actions()[action];

		if (service) {
			var ts = service({hash: hashes});
			ts.$promise.then(function() {
			//console.log(arguments);
			});
		} else {
			toastr.warning('Action ' + action + ' not yet supported',null,{timeOut: 1000});
		}
	};

	$scope.filterspanel = {
		open: true,
		filters: {
			name: '',
			label: '',
			l33t: true
		}
	};

	$scope.filters = $scope.filterspanel.filters;

	$scope.sorter = {
		field: 'torrentQueueOrder',
		secondField: 'name',
		ascending: true
	};

	$scope.doSort = function() {
		$log.info('sorting');
		var compareFunc = function(aVal,bVal) {
			if (aVal === bVal) {
				return 0;
			} else if (aVal > bVal) {
				return 1;
			} else {
				return -1;
			}
		};

		var sortFunc = function(a,b) {
			var aVal = a;
			var bVal = b;
			var tmp;
			var aField,bField;

			if (aVal === bVal) {
				return 0;
			}
			if ($scope.sorter.ascending) {
				tmp = bVal;
				bVal = aVal;
				aVal = tmp;
			}

			if (typeof aVal[$scope.sorter.field] === 'function') {
				aField = aVal[$scope.sorter.field]();
				bField = bVal[$scope.sorter.field]();
			} else {
				aField = aVal[$scope.sorter.field];
				bField = bVal[$scope.sorter.field];
			}

			if (aField === bField) {
				return 0;
				//return compareFunc(a[$scope.sorter.secondField],a[$scope.sorter.secondField]);
			} else {
				return compareFunc(aField,bField);
			}
		};
		$scope.filteredtorrents = $scope.filteredtorrents.sort(sortFunc);
	};

	$scope.sortBy = function(field) {
		if ($scope.sorter.field === field) {
			$scope.sorter.ascending = !$scope.sorter.ascending;
		} else {
			//$scope.sorter.secondField = $scope.sorter.field;
			$scope.sorter.field = field;
			//$scope.sorter.ascending = false;
		}
		$scope.doSort();
	};

	var doFilterTimer;
	$scope.doFilter = function(wait) {
		$timeout.cancel(doFilterTimer);
		var doFilter = function() {
			$log.info('filtering');
			var filters = {};

			if ($scope.filters.label === null) {
				delete filters.label;
			} else {
				filters.label = $scope.filters.label;
			}

			if ($scope.filters.name === null || $scope.filters.name === '') {
				delete filters.name;
			} else {
				var name = $scope.filters.name.split(' ').join('.');
				filters.name = name;

				if ($scope.filters.l33t === true) {
					filters.nameL33ted = '|' + $window.L33t.Translate(name);
				} else {
					filters.nameL33ted = '';
				}

			}

			$scope.filteredtorrents = $filter('filter')($scope.torrents,
				function (torrent /*, index */) {
					var matches = true;
					if (filters.label) {
						matches = torrent.label === filters.label;
					}
					if (matches && filters.name && filters.name !== '') {
						var name = torrent.name;
						matches = name.search(new RegExp(filters.name + filters.nameL33ted,'i')) > -1;
					}
					return matches;
				}
			);
			//Filtering does not preserve order
			$scope.doSort();
		};

		if (wait === true) {
			doFilterTimer = $timeout(doFilter,500);
		} else {
			doFilter();
		}
	};

	$scope.filterBy = function(/* field, query */) {
		$scope.doFilter();
	};

	var cleanName = function(name) {
		return name.replace(/\./g,' ').replace(/(\[[^\]]*\])(.*)$/,'$2 $1').trim();
	};

	$scope.reload = function(manual) {
		$scope.refreshing = true;
		$timeout.cancel(reloadTimeout);
		$log.info('reload torrents');
		//var reloadingMsg = toastr.info('Refreshing torrents...',null,{timeOut: 0});
		var ts = uTorrentService.torrents().list();

		//var ptn = $window.ptn;

		ts.$promise.then(function() {
			var changed = false;
			var i,torrent;
			var firstRun = false;
			$scope.labels = ts.label;

			if (torrentsMap === null) {
				firstRun = true;
				torrentsMap = {};
			}

			if (ts.torrents && ts.torrents.length > 0) {
				changed = true;
				$log.debug('"torrents" key with ' + ts.torrents.length + ' elements');
				var newTorrentsMap = {};
				for (i =0; i<ts.torrents.length; i++) {
					var data = null; //ptn(ts.torrents[i][2])
					torrent = Torrent.build(ts.torrents[i],data/* ,angular.toJson(data) */,cleanName(ts.torrents[i][2]));
					if (torrentsMap[torrent.hash]) {
						torrent.selected = torrentsMap[torrent.hash].selected;
					}
					newTorrentsMap[torrent.hash] = torrent;
				}
				torrentsMap = newTorrentsMap;
			}

			if (ts.torrentp && ts.torrentp.length > 0) {
				changed = true;
				$log.debug('"torrentp" key with ' + ts.torrentp.length + ' elements');
				for (i =0; i<ts.torrentp.length; i++) {
					torrent = Torrent.build(ts.torrentp[i]);
					if (torrentsMap[torrent.hash]) {
						torrent.selected = torrentsMap[torrent.hash].selected;
					}
					torrentsMap[torrent.hash] = torrent;
				}
			}

			if (ts.torrentm && ts.torrentm.length > 0) {
				changed = true;
				$log.debug('"torrentm" key with ' + ts.torrentm.length + ' elements');
				for (i =0; i<ts.torrentm.length; i++) {
					delete torrentsMap[ts.torrentm[i]];
				}
			}

			if (changed) {
				$scope.torrents = [];
				angular.forEach(torrentsMap, function(value /* , key */) {
					$scope.torrents.push(value);
				});

				$scope.doFilter();

				$scope.selectedtorrents = getSelected($scope.torrents);
			} else {
				$log.debug('no changes');
			}
			//toastr.info('Refreshing done!',null,{timeOut: 1500});
			//toastr.clear(reloadingMsg);

			if(manual !== true && $scope.autoreloadTimeout > -1) {
				reloadTimeout = $timeout($scope.reload,$scope.autoreloadTimeout);
			}
			$scope.refreshing = false;

		});
  };

  $scope.updateSelected = function() {
 		/*
 		var i;
 		for (i =0; i<$scope.torrents.length; i++) {
 			if ($scope.torrents[i].hash === item.hash) {
 				$scope.torrents[i].selected = item.;
 			}

 		}
 		*/
 		$scope.selectedtorrents = getSelected($scope.torrents);
 	};

 	$scope.setSelected = function(hash,event) {
 		var add = event.ctrlKey || event.metaKey;
    var i;
 		for (i =0; i<$scope.torrents.length; i++) {
 			var same = ($scope.torrents[i].hash === hash);
 			if (!add) {
         $scope.torrents[i].selected = same;
       } else {
         if (same) {
           $scope.torrents[i].selected = !$scope.torrents[i].selected;
         }
       }
 		}
 		$scope.updateSelected();
 	};

 	$scope.selectCheckbox = false;

  $scope.$watch( 'selectCheckbox', function ( isChecked ) {
 		var i;
 		for (i =0; i<$scope.filteredtorrents.length; i++) {
 			$scope.filteredtorrents[i].selected = isChecked;
 		}
    $scope.updateSelected();
 	});

 	$scope.$on('$destroy', function() {
 	});

 	uTorrentService.getToken(function() {
 		$scope.reload();
 	},function() {
     $log.error('error', arguments);
   });
 });
