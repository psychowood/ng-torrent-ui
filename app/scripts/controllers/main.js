/* global angular */
'use strict';

/**
 * @ngdoc function
 * @name ngTorrentUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngTorrentUiApp
 */
angular.module('ngTorrentUiApp')
    .controller('TorrentsCtrl', function($scope, $window, $uibModal, $filter, $timeout, $log, torrentServerService, Torrent, toastr, $cookies, ntuConst) {

        $scope.headerHeight = 350;
        // On window resize => resize the app
        $scope.setListHeight = function() {
            var newHeight = $window.innerHeight - 260; // - $scope.headerHeight;
            $scope.listHeight = (newHeight > 250) ? newHeight : 250;
        };

        angular.element($window).bind('resize', function() {
            $scope.setListHeight();
            $scope.$apply();
        });

        // Initiate the resize function default values
        $scope.setListHeight();

        $scope.equals = angular.equals;

        $scope.labels = [];
        $scope.labelColorMap = {};

        $scope.torrents = [];
        $scope.filteredtorrents = [];
        $scope.selectedtorrents = [];

        var torrentsMap = Torrent.cache;
        var reloadTimeout;
        $scope.autoreloadTimeout = 5000;
        $scope.autoreloadEnabled = ($scope.autoreloadTimeout > 0);

        $scope.newtorrent = '';
        $scope.newtorrentfiles = [];
        $scope.uploadDropSupported = true;

        if ($cookies.get(ntuConst.starredItems)) {
            $scope.starredItems = angular.fromJson($cookies.get(ntuConst.starredItems));
        }

        var labelColors = ['#B0C4DE', '#B0E0E6', '#87CEEB', '#87CEFA', '#00BFFF', '#1E90FF', '#6495ED', '#4682B4', '#4169E1', '#0000FF', '#0000CD', '#6A5ACD', '#7B68EE', '#00008B', '#000080', '#191970'];
        var updateLabelColorsMap = function(labels) {
            if (labels) {
                var i;
                var tot = labelColors.length;
                var sorted = angular.copy(labels).sort(function(aLbl, bLbl) {
                    var aVal = aLbl[1];
                    var bVal = bLbl[1];
                    if (aVal === bVal) {
                        return 0;
                    } else if (aVal > bVal) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                for (i = 0; i < sorted.length; i++) {
                    $scope.labelColorMap[sorted[i][0]] = labelColors[i % tot];
                }
            }
        };

        function getSelectedAndUpdateGlobals(torrentsArr) {
            var i, upSpeed = 0,
                downSpeed = 0;
            var sel = [];
            for (i = 0; i < torrentsArr.length; i++) {
                if (torrentsArr[i].selected) {
                    sel.push(torrentsArr[i]);
                }
                upSpeed += torrentsArr[i].uploadSpeed;
                downSpeed += torrentsArr[i].downloadSpeed;
            }
            $scope.uploadSpeed = upSpeed;
            $scope.downloadSpeed = downSpeed;
            return sel;
        }

        $scope.addTorrentFilesOrUrl = function(urlOrFiles) {
            var add = function(dir, subpath) {
                if (typeof urlOrFiles === 'string') {
                    torrentServerService.addTorrentUrl(urlOrFiles, dir, subpath).then(function() {
                        toastr.info('Torrent added succesfully', null, {
                            timeOut: 1000
                        });
                        $scope.newtorrent = '';
                    });
                } else {
                    if (torrentServerService.uploadTorrent) {
                        var i, success = 0;
                        var callback = function( /* data, status, headers, config */ ) {
                            success++;
                            if (success === urlOrFiles.length) {
                                toastr.info(success + ' torrent added succesfully', null, {
                                    timeOut: 2500
                                });
                                $scope.newtorrentfiles = [];
                            }
                        };
                        for (i = 0; i < urlOrFiles.length; i++) {
                            var file = urlOrFiles[i];
                            torrentServerService.uploadTorrent(file, dir, subpath).success(callback);
                        }
                    } else {
                        toastr.warning('Files upload not supported for ' + torrentServerService.getVersion(), null, {
                            timeOut: 2500
                        });
                    }
                }
            };
            if (torrentServerService.supports.getDownloadDirectories === true) {
                torrentServerService.getDownloadDirectories().then(function(directories) {
                    $scope.directories = directories;

                    var modalInstance = $uibModal.open({
                        templateUrl: 'downloadLocationModal.html',
                        backdrop: true,
                        scope: $scope
                    });

                    modalInstance.result.then(function(res) {
                        add(res.dir, res.path);
                    });
                });
            } else {
                add('0', '');
            }

        };

        $scope.addTorrentFilesChanged = function(files, event, rejectedFiles) {
            var rejected = 0;
            var i;
            if (rejectedFiles && rejectedFiles.length > 0) {
                for (i = 0; i < rejectedFiles.length; i++) {
                    rejected++;
                }
            }
            for (i = 0; i < files.length; i++) {
                if (files[i].name.search(/^.*\.torrent$/i) === -1) {
                    rejected++;
                }
            }
            if (rejected > 0) {
                toastr.warning(rejected + ' files ignored (not .torrent files)', null, {
                    timeOut: 2500
                });
            }
        };

        function getSelectedHashes(item) {
            var hashes = [];
            if (!item) {
                angular.forEach($scope.selectedtorrents, function(value /* , key */ ) {
                    hashes.push(value.hash);
                });
            } else {
                hashes.push(item.hash);
            }

            return hashes;
        }

        $scope.doAction = function(action, item, callback) {
            var hashes = getSelectedHashes(item);

            if (action === 'info') {
                $scope.showDetails(item);
                return;
            }

            if (action === 'star') {
                $scope.showStar(item.isStarred ? '' : item.decodedName, $scope.starredItems);
                return;
            }

            var service = torrentServerService.actions()[action];

            if (service) {
                var ts = service({
                    hash: hashes
                });
                ts.$promise.then(function() {
                    if(callback) {
                        callback();
                    }
                });
                return ts;
            } else {
                toastr.warning('Action ' + action + ' not yet supported', null, {
                    timeOut: 1000
                });
            }
        };

        $scope.setLabel = function(value, item) {
            var hashes = getSelectedHashes(item);

            var service = torrentServerService.setLabel;
            $scope.labelToSet = '';

            if (service) {
                var ts = service(hashes, value);
                ts.success(function() {
                    if (value === '') {
                        toastr.info('Label removed', null, {
                            timeOut: 2500
                        });
                    } else {
                        toastr.info('Label set to "' + value + '"', null, {
                            timeOut: 2500
                        });
                    }
                });
                return ts;
            } else {
                toastr.warning('Setting label not supported', null, {
                    timeOut: 1000
                });
            }
        };

        $scope.setNewLabel = function(item) {

            var modalInstance = $uibModal.open({
                templateUrl: 'newLabelModal.html',
                backdrop: true
            });

            modalInstance.result.then(function(newLabel) {
                return $scope.setLabel(newLabel, item);
            }, function() {

            });

        };

        $scope.showStar = function(name, currentStarred) {
            var modalInstance = $uibModal.open({
                controller: ['$scope', function($scope) {
                    $scope.starredItems = currentStarred;
                    $scope.newStarred = name;
                }],
                templateUrl: 'starredModal.html',
                backdrop: true
            });

            modalInstance.result.then(function(starredItems) {
                var obj = angular.toJson(starredItems);
                $cookies.put(ntuConst.starredItems, obj);
                $scope.starredItems = starredItems;
            }, function() {

            });

        };

        $scope.searchSimilar = function(torrent) {
            var filter = '';
            var fuzzy = false;
            var starredName = $scope.starredNamesStrings[torrent.decodedName];
            
            if (starredName && $scope.filters.name !== starredName) {
                filter = starredName;
                fuzzy = false;
            } else if (!starredName && $scope.filters.name !== torrent.cleanedName){ 
                filter = torrent.cleanedName;
                fuzzy = true;
            }
            
            $scope.filters.name = filter;
            $scope.filters.fuzzy = fuzzy;
            $scope.doFilter();
        };
        $scope.showActions = function(torrent) {
            var $parentScope = $scope;
            var modalInstance = $uibModal.open({
                controller: ['$scope', function($scope) {
                    $scope.item = torrent;
                    $scope.starredNamesStrings = $parentScope.starredNamesStrings;
                    $scope.doAction = function(action,torrent) {
                        $parentScope.doAction(action,torrent,function() {
                            $scope.$close();    
                        }); 
                    };
                    $scope.search = function(torrent) {
                      $parentScope.searchSimilar(torrent);
                      $scope.$close();  
                    };
                    
                }],
                windowClass: 'actionsModal',
                backdropClass: 'gray-background',
                templateUrl: 'actionsModal.html',
                backdrop: true
            });
            
            console.log(modalInstance);
        };

        $scope.emptyFilters = {
            name: '',
            label: undefined,
            l33t: true,
            selected: false,
            status: '',
            fuzzy: false
        };

        $scope.filters = angular.copy($scope.emptyFilters);

        $scope.sorter = {
            field: 'torrentQueueOrder',
            secondField: 'name',
            ascending: true
        };

        $scope.doSort = function() {
            $log.info('sorting');
            var compareFunc = function(aVal, bVal) {
                if (aVal === bVal) {
                    return 0;
                } else if (aVal > bVal) {
                    return 1;
                } else {
                    return -1;
                }
            };

            var sortFunc = function(a, b) {
                var aVal = a;
                var bVal = b;
                var tmp;
                var aField, bField;

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
                    var aSecondField = a[$scope.sorter.secondField];
                    var bSecondField = b[$scope.sorter.secondField];

                    if (aSecondField !== bSecondField) {
                        if ($scope.sorter.ascending) {
                            return compareFunc(aSecondField, bSecondField);
                        } else {
                            return compareFunc(bSecondField, aSecondField);
                        }
                    } else {
                        return 0;
                    }
                } else {
                    return compareFunc(aField, bField);
                }
            };
            $scope.filteredtorrents = $scope.filteredtorrents.sort(sortFunc);
        };

        $scope.sortBy = function(field) {
            if ($scope.sorter.field === field) {
                $scope.sorter.ascending = !$scope.sorter.ascending;
            } else {
                $scope.sorter.field = field;
            }
            $scope.doSort();
        };

        var doFilterTimer;
        $scope.notL33table = false;
        $scope.clearFilters = function() {
            $scope.filters = angular.copy($scope.emptyFilters);
            $scope.doFilter();
        };
        $scope.doFilter = function(wait) {

            $scope.notL33table = $scope.filters.name.search(/^[a-z0-9 ]+$/i) === -1;

            $timeout.cancel(doFilterTimer);
            var doFilter = function() {
                $log.info('filtering');
                var filters = {};
                var i, c, l;

                if ($scope.filters.label === null) {
                    delete filters.label;
                } else {
                    filters.label = $scope.filters.label;
                }

                if ($scope.filters.status === null) {
                    delete filters.status;
                } else {
                    filters.status = $scope.filters.status;
                }

                filters.selected = $scope.filters.selected;
                filters.fuzzy = $scope.filters.fuzzy;

                if ($scope.filters.name === null || $scope.filters.name === '') {
                    delete filters.name;
                } else {
                    var name = $scope.filters.name.split(' ').join('.');
                    filters.name = name;

                    if (!$scope.notL33table && $scope.filters.l33t === true) {
                        var leetedName = '';
                        for (i = 0; i < name.length; i++) {
                            c = name.charAt(i);
                            l = $window.L33t.Translate(c);
                            if (c === l) {
                                leetedName += c;
                            } else {
                                leetedName += '[' + c + l + ']';
                            }

                        }
                        filters.name = leetedName;
                    }
                }

                $scope.filteredtorrents = $filter('filter')($scope.torrents,
                    function(torrent /*, index */ ) {
                        var matches = true;
                        if (typeof filters.label !== 'undefined') {
                            matches = torrent.label === filters.label;
                        }
                        if (filters.selected) {
                            matches = torrent.selected === true;
                        }
                        if (filters.status) {
                            switch (filters.status) {
                                case 'completed':
                                    {
                                        matches = torrent.isStatusCompleted();
                                        break;
                                    }
                                case 'downloading':
                                    {
                                        matches = torrent.isStatusDownloading();
                                        break;
                                    }
                                case 'paused':
                                    {
                                        matches = torrent.isStatusPaused();
                                        break;
                                    }
                                case 'queued':
                                    {
                                        matches = torrent.isStatusQueued();
                                        break;
                                    }
                                case 'seeding':
                                    {
                                        matches = torrent.isStatusSeeding();
                                        break;
                                    }
                                case 'error':
                                    {
                                        matches = torrent.isStatusError();
                                        break;
                                    }
                            }
                        }
                        if (matches && filters.name && filters.name !== '') {
                            var name = torrent.name;
                            matches = name.search(new RegExp(filters.name, 'i')) > -1;
                        
                            if (!matches && filters.fuzzy) {
                                name = torrent.decodedName;
                                var subStrscore = name.subCompare($scope.filters.name);
                                matches = (subStrscore.found === 1);
                            }
                        }
                        return matches;
                    }
                );
                //Filtering does not preserve order
                $scope.doSort();
            };

            if (wait === true) {
                doFilterTimer = $timeout(doFilter, 500);
            } else {
                doFilter();
            }
        };

        $scope.filterBy = function( /* field, query */ ) {
            $scope.doFilter();
        };

        if ($cookies.get(ntuConst.decodeNames)) {
            $scope.decodeNames = $cookies.get(ntuConst.decodeNames) === 'true';
        } else {
            $scope.decodeNames = true;
        }

        var cleanName = function(name) {
            if ($scope.decodeNames) {
                return name.replace(/[\._]/g, ' ').replace(/(\[[^\]]*\])(.*)$/, '$2 $1').trim();
            } else {
                return name;
            }
        };

        $scope.starredNamesStrings = {};
        var starredNamesStrings = $scope.starredNamesStrings;
         
        var isStarred = function(name) {
            var array = $scope.starredItems;
            if (array) {
                for (var i = 0; i < array.length; i++) {
                    if (name.indexOf(array[i].text) !== -1) {
                        starredNamesStrings[name] = array[i].text;
                        return true;
                    }
                }
            }
            delete starredNamesStrings[name];
            return false;
        };

        $scope.reload = function(manual) {
            if ($scope.refreshing) {
                return;
            }

            $scope.refreshing = true;
            $timeout.cancel(reloadTimeout);
            $log.info('reload torrents');
            var ts = torrentServerService.torrents();

            ts.then(function(torrents) {
                var changed = false;
                var i, torrent;
                $scope.labels = torrents.labels;
                updateLabelColorsMap($scope.labels);

                if (torrentsMap === null) {
                    torrentsMap = {};
                }

                var decodedName = null;

                if (torrents.all && torrents.all.length > 0) {
                    changed = true;
                    $log.debug('"torrents.all" key with ' + torrents.all.length + ' elements');
                    var newTorrentsMap = {};

                    for (i = 0; i < torrents.all.length; i++) {
                        decodedName = cleanName(torrents.all[i][2]);
                        torrent = torrentServerService.build(torrents.all[i], null /* ptn(torrents.all[i][2]) */ , decodedName, isStarred(decodedName));
                        if (torrentsMap[torrent.hash]) {
                            torrent.selected = torrentsMap[torrent.hash].selected;
                            torrent.files = torrentsMap[torrent.hash].files;
                        }
                        newTorrentsMap[torrent.hash] = torrent;
                    }
                    torrentsMap = newTorrentsMap;
                }

                if (torrents.changed && torrents.changed.length > 0) {
                    changed = true;
                    $log.debug('"torrentp" key with ' + torrents.changed.length + ' elements');
                    for (i = 0; i < torrents.changed.length; i++) {
                        decodedName = cleanName(torrents.changed[i][2]);
                        torrent = torrentServerService.build(torrents.changed[i], null /* ptn(torrents.changed[i][2]) */ , decodedName, isStarred(decodedName));
                        if (torrentsMap[torrent.hash]) {
                            torrent.selected = torrentsMap[torrent.hash].selected;
                            torrent.files = torrentsMap[torrent.hash].files;
                        }
                        torrentsMap[torrent.hash] = torrent;
                    }
                }

                if (torrents.deleted && torrents.deleted.length > 0) {
                    changed = true;
                    $log.debug('"torrentm" key with ' + torrents.deleted.length + ' elements');
                    for (i = 0; i < torrents.deleted.length; i++) {
                        delete torrentsMap[torrents.deleted[i]];
                    }
                }

                if (changed) {
                    $scope.torrents = [];
                    angular.forEach(torrentsMap, function(value /* , key */ ) {
                        $scope.torrents.push(value);
                    });
                    $scope.doFilter();
                    Torrent.cache = torrentsMap;
                    $scope.selectedtorrents = getSelectedAndUpdateGlobals($scope.torrents);
                } else {
                    $log.debug('no changes');
                }
                //toastr.info('Refreshing done!',null,{timeOut: 1500});
                //toastr.clear(reloadingMsg);

                if (manual !== true && $scope.autoreloadEnabled === true && $scope.autoreloadTimeout > -1) {
                    reloadTimeout = $timeout($scope.reload, $scope.autoreloadTimeout);
                }
                $scope.torrentsMap = torrentsMap;
                updateTorrentDetails($scope.lastTorrentDetails);

                var numOfLabeledTorrents = 0;
                angular.forEach($scope.labels, function(value /* , key */ ) {
                    numOfLabeledTorrents = numOfLabeledTorrents + value[1];
                });

                $scope.labels.unshift(['', $scope.torrents.length - numOfLabeledTorrents]);


                $scope.refreshing = false;

            });
        };

        var updateTorrentDetails = function(torrent) {
            if (torrent) {
                $scope.doAction('getprops', torrent).$promise.then(function(res) {
                    torrent.props = res.props[0];
                });
                $scope.doAction('getfiles', torrent).$promise.then(function(res) {
                    var i;
                    var files = res.files;
                    if (torrent.files) {
                        for (i = 0; i < torrent.files.length; i++) {
                            files[i].selected = torrent.files[i].selected;
                        }
                    }
                    torrent.files = files;
                });
            }
        };

        $scope.showSearch = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/yts-movies.html',
                controller: 'YtsMoviesCtrl',
                windowClass: 'modal-search',
                backdrop: true,
                resolve: {
                    addTorrent: function() {
                        return $scope.addTorrent;
                    }
                }
            });

            modalInstance.result.then(function() {

            }, function() {
                $scope.lastTorrentDetails = null;
            });
        };

        $scope.showDetails = function(item) {
            $scope.lastTorrentDetails = item;
            updateTorrentDetails(item);
            var modalInstance = $uibModal.open({
                templateUrl: 'views/details-dialog.html',
                controller: 'DetailsDialogCtrl',
                windowClass: 'modal-details',
                backdrop: true,
                resolve: {
                    torrent: function() {
                        return $scope.lastTorrentDetails;
                    }
                }
            });

            modalInstance.result.then(function() {

            }, function() {
                var i;
                for (i = 0; i < item.files.length; i++) {
                    item.files[i].selected = false;
                }
                $scope.lastTorrentDetails = null;
            });
        };

        $scope.updateSelected = function() {
            $scope.selectedtorrents = getSelectedAndUpdateGlobals($scope.torrents);
        };

        $scope.lastSelectedHash = null;

        $scope.setSelected = function(hash, event, forceShift) {
            $log.info('setSelected', hash);
            var ctrl = event.ctrlKey || event.metaKey;
            var shift = event.shiftKey || forceShift;
            var i, j = 0;

            if (shift) {
                var selIndex = -1;
                var lastSelIndex = -1;
                for (i = 0; i < $scope.filteredtorrents.length; i++) {
                    if (selIndex === -1 && $scope.filteredtorrents[i].hash === hash) {
                        selIndex = i;
                    }
                    if (lastSelIndex === -1 && $scope.filteredtorrents[i].hash === $scope.lastSelectedHash) {
                        lastSelIndex = i;
                    }
                    if (selIndex !== -1 && lastSelIndex !== -1) {
                        break;
                    }
                }

                if (selIndex === lastSelIndex) {
                    return;
                }

                if (lastSelIndex === -1) {
                    lastSelIndex = 0;
                }

                if (selIndex > lastSelIndex) {
                    j = selIndex + 1;
                    i = lastSelIndex;
                } else {
                    j = lastSelIndex + 1;
                    i = selIndex;
                }

                for (; i < j; i++) {
                    $scope.filteredtorrents[i].selected = true;
                }
            } else if (ctrl) {
                for (i = 0; i < $scope.torrents.length; i++) {
                    if (($scope.torrents[i].hash === hash)) {
                        $scope.torrents[i].selected = !$scope.torrents[i].selected;
                    }
                }
            } else {
                for (i = 0; i < $scope.torrents.length; i++) {
                    var same = ($scope.torrents[i].hash === hash);
                    $scope.torrents[i].selected = same;
                }
            }
            $scope.lastSelectedHash = hash;
            (function() {
                var selection = ('getSelection' in $window) ? $window.getSelection() : ('selection' in $window.document) ? $window.document.selection : null;
                if ('removeAllRanges' in selection) {
                    selection.removeAllRanges();
                } else if ('empty' in selection) {
                    selection.empty();
                }
            })();
            $scope.updateSelected();
        };

        $scope.selectCheckbox = false;

        $scope.clearSelected = function() {
            var i;
            for (i = 0; i < $scope.selectedtorrents.length; i++) {
                $scope.selectedtorrents[i].selected = false;
            }
            $scope.updateSelected();
        };

        $scope.$watch('selectCheckbox', function(isChecked) {
            var i;
            for (i = 0; i < $scope.filteredtorrents.length; i++) {
                $scope.filteredtorrents[i].selected = isChecked;
            }
            $scope.updateSelected();
        });

        $scope.$on('$destroy', function() {});

        torrentServerService.init().then(function() {
            $scope.reload();
        }, function() {
            $log.error('error', arguments);
        });

        $scope.$on('$routeChangeStart', function( /* scope, next, current */ ) {
            //Prevent multiple reload timers when switching tabs
            $timeout.cancel(reloadTimeout);
        });
    });