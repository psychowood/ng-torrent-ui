'use strict';

/**
 * @ngdoc function
 * @name utorrentNgwebuiApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the utorrentNgwebuiApp
 */
 angular.module('utorrentNgwebuiApp')
 .controller('SettingsCtrl', function ($scope,uTorrentService,$log,$translate,toastr,$timeout,$cookies) {

  var settings = {
    conf: [],
    values: [],
    map: {}
  };

  if ($cookies.get('starredItems')){
    $scope.starredItems = angular.fromJson($cookies.get('starredItems'));
  }
  
  $scope.starredItemsChanged = function() {
    $cookies.put('starredItems',angular.toJson($scope.starredItems));
  };

  var doFilterTimer;
  $scope.updateSettingSearch = function(value) {
    $timeout.cancel(doFilterTimer);
    doFilterTimer = $timeout(function() {
      $scope.settingSearch = value;
    },500);
  };

  $scope.updateSettingsCount = function(section,subsection,count) {
    section.count = count;
    subsection.count = count;
  };

  $scope.settings = settings;
  var getSettingTexts = function(setArr,sectionId,subsectionId) {
    var setting = settings.map[setArr[0]];
    if (angular.isUndefined(setting)) {
      setting = {
        id: setArr[0]
      };
      settings.map[setting.id] = setting;
    }
    $translate(setArr[1]).then(function (val) { setting.label = val; });
    $translate(sectionId).then(function (val) { setting.sectionLabel = val; });
    $translate(subsectionId).then(function (val) { setting.subsectionLabel = val; });
    if (!angular.isUndefined(setArr[2])) {
      setting.type = 'select';
      setting.values = [];
      $translate(setArr[2]).then(function (val) {
        setting.values = val.split('||').slice(0,-1);
      });
    }
    return setting;
  };
  $scope.getSettingTexts = getSettingTexts;



  var initData = function(conf) {
    var i,j,k;
    var section, subsection, settingArr;
    var newSection, newSubSection, newSetting;

    var result = [];
    var setLabel = function(label,obj) {
      $translate(label).then(function (val) { obj.label = val; });
    };

    for (i in conf) {
      section = conf[i];
      newSection = {
        label: '',
        items: [],
        count: 0
      };
      result.push(newSection);
      setLabel(section[0],newSection);
      for(j in section[1]) {
        subsection = section[1][j];
        newSubSection = {
          label: '',
          items: [],
          count: 0
        };
        newSection.items.push(newSubSection);
        setLabel(subsection[0],newSubSection);

        for (k in subsection[1]) {
          settingArr = subsection[1][k];
          newSetting = getSettingTexts(settingArr,section[0],subsection[0]);
          newSubSection.items.push(newSetting);
        }
      }
    }
    return result;
  };

 	uTorrentService.init().then(function() {
     var set = uTorrentService.actions().getsettings();
     set.$promise.then(function() {
       var i;
       var values = set.sort(function(a,b) {
         if (a.name === b.name) { return 0; }
         if (a.name > b.name) { return 1; }
         return -1;
       });
       settings.values = set;
       for (i=0; i<values.length; i++) {
         var setting = settings.map[values[i].name];
         if (angular.isUndefined(setting)) {
           setting = {
             id: values[i].name
           };
           settings.map[setting.id] = setting;
         }
         if (angular.isUndefined(setting.type)) {
           setting.type = values[i].type;
         }
         setting.value = values[i].value;
         setting.oldvalue = setting.value;
         setting.known = true;
       }
       settings.conf = initData(conf);
     });
 	},function() {
     $log.error('error', arguments);
   });

  $scope.saveSetting = function(setting) {
    var service = uTorrentService.setSetting;

    $log.debug('save setting',setting);

  	if (service) {
      setting.saving = true;
  		var ts = service(setting.id,setting.value);
  		ts.success(function() {
        $log.info('saved',setting, arguments);
        setting.oldvalue = setting.value;
        setting.saving = false;
  		}).error(function() {
        toastr.error('Error saving setting ' + (setting.label !== '')?setting.label:setting.id,null,{timeOut: 5000});
      });
     return ts;
  	} else {
  		toastr.warning('Saving settings not supported',null,{timeOut: 1000});
  	}
  };

  $scope.loadingFinished = function() {
    $scope.loaded = true;
  };

  var conf = [
        ['ST_CAPT_GENERAL',[
                 ['DLG_SETTINGS_1_GENERAL_10',[
                     ['check_update' , 'DLG_SETTINGS_1_GENERAL_11'],
                     ['check_update_beta' , 'DLG_SETTINGS_1_GENERAL_12'],
                     ['anoninfo' , 'DLG_SETTINGS_1_GENERAL_13']
                 ]],
                 ['DLG_SETTINGS_1_GENERAL_17',[
                     ['append_incomplete' , 'DLG_SETTINGS_1_GENERAL_18'],
                     ['prealloc_space' , 'DLG_SETTINGS_1_GENERAL_19'],
                     ['sys.prevent_standby' , 'DLG_SETTINGS_1_GENERAL_20']
                 ]]
        ]],
        ['ST_CAPT_UI_SETTINGS',[
                 ['DLG_SETTINGS_2_UI_01',[
                     ['confirm_when_deleting' , 'DLG_SETTINGS_2_UI_02'],
                     ['confirm_remove_tracker' , 'DLG_SETTINGS_2_UI_03'],
                     ['confirm_exit' , 'DLG_SETTINGS_2_UI_04'],
                     ['gui.alternate_color' , 'DLG_SETTINGS_2_UI_05'],
                     ['gui.speed_in_title' , 'DLG_SETTINGS_2_UI_06'],
                     ['gui.limits_in_statusbar' , 'DLG_SETTINGS_2_UI_07']
                 ]],
                 ['DLG_SETTINGS_2_UI_15',[
                     ['torrents_start_stopped' , 'DLG_SETTINGS_2_UI_16'],
                     ['activate_on_file' , 'DLG_SETTINGS_2_UI_17'],
                     ['show_add_dialog' , 'DLG_SETTINGS_2_UI_18']
                 ]],
                 ['DLG_SETTINGS_2_UI_19',[
                     ['gui.dblclick_seed' , 'DLG_SETTINGS_2_UI_20', 'ST_CBO_UI_DBLCLK_TOR'],
                     ['gui.dblclick_dl' , 'DLG_SETTINGS_2_UI_22', 'ST_CBO_UI_DBLCLK_TOR' ]
                 ]]
        ]],
        ['ST_CAPT_FOLDER',[
                 ['DLG_SETTINGS_3_PATHS_01',[
                     ['always_show_add_dialog' , 'DLG_SETTINGS_3_PATHS_03'],
                     ['dir_active_download_flag' , 'DLG_SETTINGS_3_PATHS_02'],
                     ['dir_active_download' , ''],
                     ['dir_add_label' , 'DLG_SETTINGS_3_PATHS_07'],
                     ['dir_completed_download_flag' , 'DLG_SETTINGS_3_PATHS_06'],
                     ['dir_completed_download' , ''],
                     ['move_if_defdir' , 'DLG_SETTINGS_3_PATHS_10']
                 ]],
                 ['DLG_SETTINGS_3_PATHS_11',[
                     ['dir_torrent_files_flag' , 'DLG_SETTINGS_3_PATHS_12'],
                     ['dir_torrent_files' , ''],
                     ['dir_completed_torrents_flag' , 'DLG_SETTINGS_3_PATHS_15'],
                     ['dir_completed_torrents' , ''],
                     ['dir_autoload_delete' , 'DLG_SETTINGS_3_PATHS_19'],
                     ['dir_autoload_flag' , 'DLG_SETTINGS_3_PATHS_18'],
                     ['dir_autoload' , '']
                 ]]
        ]],
        ['ST_CAPT_CONNECTION',[
                 ['DLG_SETTINGS_4_CONN_01',[
                     ['bind_port' , 'DLG_SETTINGS_4_CONN_02'],
                     ['upnp' , 'DLG_SETTINGS_4_CONN_06'],
                     ['rand_port_on_start' , 'DLG_SETTINGS_4_CONN_05'],
                     ['natpmp' , 'DLG_SETTINGS_4_CONN_07'],
                     ['disable_fw' , 'DLG_SETTINGS_4_CONN_21']
                 ]],
                 ['DLG_SETTINGS_4_CONN_08',[
                     ['proxy.type' , 'DLG_SETTINGS_4_CONN_09','ST_CBO_PROXY'],
                     ['proxy.proxy' , 'DLG_SETTINGS_4_CONN_11'],
                     ['proxy.port' , 'DLG_SETTINGS_4_CONN_13'],
                     ['proxy.auth' , 'DLG_SETTINGS_4_CONN_15'],
                     ['proxy.username' , 'DLG_SETTINGS_4_CONN_16'],
                     ['proxy.password' , 'DLG_SETTINGS_4_CONN_18'],
                     ['proxy.resolve' , 'DLG_SETTINGS_4_CONN_19'],
                     ['proxy.p2p' , 'DLG_SETTINGS_4_CONN_20']
                 ]],
                 ['DLG_SETTINGS_4_CONN_22',[
                     ['no_local_dns' , 'DLG_SETTINGS_4_CONN_23'],
                     ['private_ip' , 'DLG_SETTINGS_4_CONN_24'],
                     ['only_proxied_conns' , 'DLG_SETTINGS_4_CONN_25']
                 ]]
        ]],
        ['ST_CAPT_BANDWIDTH',[
                 ['DLG_SETTINGS_5_BANDWIDTH_01',[
                     ['max_ul_rate' , 'DLG_SETTINGS_5_BANDWIDTH_02'],
                     ['max_ul_rate_seed_flag' , 'DLG_SETTINGS_5_BANDWIDTH_05'],
                     ['max_ul_rate_seed' , '']
                 ]],
                 ['DLG_SETTINGS_5_BANDWIDTH_07',[
                     ['max_dl_rate' , 'DLG_SETTINGS_5_BANDWIDTH_08']
                 ]],
                 ['DLG_SETTINGS_5_BANDWIDTH_18',[
                     ['net.calc_overhead' , 'DLG_SETTINGS_5_BANDWIDTH_19'],
                     ['net.ratelimit_utp' , 'DLG_SETTINGS_5_BANDWIDTH_20']
                 ]],
                 ['DLG_SETTINGS_5_BANDWIDTH_10',[
                     ['conns_globally' , 'DLG_SETTINGS_5_BANDWIDTH_11'],
                     ['conns_per_torrent' , 'DLG_SETTINGS_5_BANDWIDTH_14'],
                     ['ul_slots_per_torrent' , 'DLG_SETTINGS_5_BANDWIDTH_15'],
                     ['extra_ulslots' , 'DLG_SETTINGS_5_BANDWIDTH_17']
                 ]]
        ]],
        ['ST_CAPT_BITTORRENT',[
                 ['DLG_SETTINGS_6_BITTORRENT_01',[
                     ['dht' , 'DLG_SETTINGS_6_BITTORRENT_02'],
                     ['enable_scrape' , 'DLG_SETTINGS_6_BITTORRENT_03'],
                     ['dht_per_torrent' , 'DLG_SETTINGS_6_BITTORRENT_04'],
                     ['pex' , 'DLG_SETTINGS_6_BITTORRENT_05'],
                     ['lsd' , 'DLG_SETTINGS_6_BITTORRENT_06'],
                     ['rate_limit_local_peers' , 'DLG_SETTINGS_6_BITTORRENT_07'],
                     ['enable_bw_management' , 'DLG_SETTINGS_6_BITTORRENT_14'],
                     ['use_udp_trackers' , 'DLG_SETTINGS_6_BITTORRENT_15'],
                     ['tracker_ip' , 'DLG_SETTINGS_6_BITTORRENT_08']
                 ]],
                 ['DLG_SETTINGS_6_BITTORRENT_10',[
                     ['encryption_mode' , 'DLG_SETTINGS_6_BITTORRENT_11', 'ST_CBO_ENCRYPTIONS'],
                     ['encryption_allow_legacy' , 'DLG_SETTINGS_6_BITTORRENT_13']
                 ]]
        ]],
        ['ST_CAPT_TRANSFER_CAP',[
                 ['DLG_SETTINGS_7_TRANSFERCAP_02',[
                     ['multi_day_transfer_limit_en' , 'DLG_SETTINGS_7_TRANSFERCAP_01'],
                     ['multi_day_transfer_mode' , 'DLG_SETTINGS_7_TRANSFERCAP_03','ST_CBO_TCAP_MODES'],
                     ['multi_day_transfer_limit_unit' , 'ST_CBO_TCAP_UNITS'],
                     ['multi_day_transfer_limit_value' , 'DLG_SETTINGS_7_TRANSFERCAP_04'],
                     ['multi_day_transfer_limit_span' , 'DLG_SETTINGS_7_TRANSFERCAP_05','ST_CBO_TCAP_PERIODS']
                 ]],
                 ['DLG_SETTINGS_7_TRANSFERCAP_06',[
                     ['total_uploaded_history' , 'DLG_SETTINGS_7_TRANSFERCAP_07'],
                     ['total_downloaded_history' , 'DLG_SETTINGS_7_TRANSFERCAP_08'],
                     ['total_updown_history' , 'DLG_SETTINGS_7_TRANSFERCAP_09'],
                     ['history_period' , 'DLG_SETTINGS_7_TRANSFERCAP_10']
                 ]],
                 ['DLG_SETTINGS_7_TRANSFERCAP_12' , []]
        ]],
        ['ST_CAPT_QUEUEING',[
                 ['DLG_SETTINGS_8_QUEUEING_01',[
                     ['max_active_torrent' , 'DLG_SETTINGS_8_QUEUEING_02'],
                     ['max_active_downloads' , 'DLG_SETTINGS_8_QUEUEING_04']
                 ]],
                 ['DLG_SETTINGS_8_QUEUEING_06',[
                     ['seed_ratio' , 'DLG_SETTINGS_8_QUEUEING_07'],
                     ['seed_time' , 'DLG_SETTINGS_8_QUEUEING_09'],
                     ['seeds_prioritized' , 'DLG_SETTINGS_8_QUEUEING_11']
                 ]],
                 ['DLG_SETTINGS_8_QUEUEING_12',[
                     ['seed_prio_limitul_flag' , 'DLG_SETTINGS_8_QUEUEING_13'],
                     ['seed_prio_limitul' , '']
                 ]]
        ]],
        ['ST_CAPT_SCHEDULER',[
                 ['DLG_SETTINGS_9_SCHEDULER_02',[
                     ['sched_enable' , 'DLG_SETTINGS_9_SCHEDULER_01'],
                     ['sched_table_lgnd_off' , 'ST_SCH_LGND_OFF'],
                     ['sched_table_lgnd_seeding' , 'ST_SCH_LGND_SEEDING'],
                     ['sched_table_lgnd_full' , 'ST_SCH_LGND_FULL'],
                     ['sched_table_lgnd_limited' , 'ST_SCH_LGND_LIMITED']
                 ]],
                 ['DLG_SETTINGS_9_SCHEDULER_04',[
                     ['sched_ul_rate' , 'DLG_SETTINGS_9_SCHEDULER_05'],
                     ['sched_dis_dht' , 'DLG_SETTINGS_9_SCHEDULER_09'],
                     ['sched_dl_rate' , 'DLG_SETTINGS_9_SCHEDULER_07']
                 ]]
        ]],
        ['ST_CAPT_REMOTE',[
                 ['DLG_SETTINGS_10_REMOTE_03',[
                     ['webui.uconnect_enable' , 'DLG_SETTINGS_10_REMOTE_02'],
                     ['webui.uconnect_username' , 'DLG_SETTINGS_10_REMOTE_04'],
                     ['webui.uconnect_password' , 'DLG_SETTINGS_10_REMOTE_05']
                 ]]
        ]],
        ['ST_CAPT_ADVANCED',[
                 ['DLG_SETTINGS_A_ADVANCED_01' ,[
                   ['DLG_SETTINGS_A_ADVANCED_02' , []],
                   ['DLGSettings-advTrue' , 'DLG_SETTINGS_A_ADVANCED_03'],
                   ['DLGSettings-advFalse' , 'DLG_SETTINGS_A_ADVANCED_04'],
                   ['DLG_SETTINGS_A_ADVANCED_05' , []]
                 ]]
        ]],
        ['ST_CAPT_UI_EXTRAS',[
                 ['DLG_SETTINGS_B_ADV_UI_01',[
                     ['gui.manual_ratemenu' , 'DLG_SETTINGS_B_ADV_UI_02'],
                     ['gui.ulrate_menu' , 'DLG_SETTINGS_B_ADV_UI_03'],
                     ['gui.dlrate_menu' , 'DLG_SETTINGS_B_ADV_UI_05']
                 ]],
                 ['DLG_SETTINGS_B_ADV_UI_07',[
                     ['gui.persistent_labels' , '']
                 ]],
                 ['DLG_SETTINGS_B_ADV_UI_08',[
                     ['search_list' , '']
                 ]]
        ]],
        ['ST_CAPT_DISK_CACHE',[
                 ['DLG_SETTINGS_C_ADV_CACHE_01',[
                     ['cache.override' , 'DLG_SETTINGS_C_ADV_CACHE_03'],
                     ['cache.override_size' , ''],
                     ['cache.reduce' , 'DLG_SETTINGS_C_ADV_CACHE_05']
                 ]],
                 ['DLG_SETTINGS_C_ADV_CACHE_06',[
                     ['cache.write' , 'DLG_SETTINGS_C_ADV_CACHE_07'],
                     ['cache.writeout' , 'DLG_SETTINGS_C_ADV_CACHE_08'],
                     ['cache.writeimm' , 'DLG_SETTINGS_C_ADV_CACHE_09'],
                     ['cache.read' , 'DLG_SETTINGS_C_ADV_CACHE_10'],
                     ['cache.read_turnoff' , 'DLG_SETTINGS_C_ADV_CACHE_11'],
                     ['cache.read_prune' , 'DLG_SETTINGS_C_ADV_CACHE_12'],
                     ['cache.read_thrash' , 'DLG_SETTINGS_C_ADV_CACHE_13'],
                     ['cache.disable_win_write' , 'DLG_SETTINGS_C_ADV_CACHE_14'],
                     ['cache.disable_win_read' , 'DLG_SETTINGS_C_ADV_CACHE_15']
                 ]]
        ]],
        ['ST_CAPT_WEBUI',[
                 ['DLG_SETTINGS_9_WEBUI_02',[
                     ['webui.enable' , 'DLG_SETTINGS_9_WEBUI_01'],
                     ['webui.username' , 'DLG_SETTINGS_9_WEBUI_03'],
                     ['webui.password' , 'DLG_SETTINGS_9_WEBUI_05'],
                     ['webui.enable_guest' , 'DLG_SETTINGS_9_WEBUI_07'],
                     ['webui.guest' , '']
                 ]],
                 ['DLG_SETTINGS_9_WEBUI_09',[
                     ['webui.enable_listen' , 'DLG_SETTINGS_9_WEBUI_10'],
                     ['webui.port' , ''],
                     ['webui.restrict' , 'DLG_SETTINGS_9_WEBUI_12'],
                     ['webui.showToolbar' , 'MM_OPTIONS_SHOW_TOOLBAR'],
                     ['webui.showCategories' , 'MM_OPTIONS_SHOW_CATEGORY'],
                     ['webui.showDetails' , 'MM_OPTIONS_SHOW_DETAIL'],
                     ['webui.showStatusBar' , 'MM_OPTIONS_SHOW_STATUS'],
                     ['webui.updateInterval' , 'Update GUI every (ms)'],
                     ['webui.maxRows' , 'Max. rows per page'],
                     ['webui.useSysFont' , 'Use system fonts']
                 ]]
        ]],
        ['ST_CAPT_RUN_PROGRAM',[
                 ['DLG_SETTINGS_C_ADV_RUN_01',[
                     ['finish_cmd' , 'DLG_SETTINGS_C_ADV_RUN_02'],
                     ['state_cmd' , 'DLG_SETTINGS_C_ADV_RUN_04'],
                 ]],
                 ['DLG_SETTINGS_C_ADV_RUN_06' ,[
                 ]]
        ]]];

 });
