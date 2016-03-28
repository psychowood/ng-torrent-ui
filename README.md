[![Build Status](https://travis-ci.org/psychowood/ng-torrent-ui.svg)](https://travis-ci.org/psychowood/ng-torrent-ui)
![Logo](app/favicon.png?raw=true "Logo") ng-torrent-ui
=============

ng-torrent-ui is born as a replacement for the uTorrent WebUI, focusing on download management and responsiveness instead of covering each and every functionality.
The use of virtual scrolling removes the need for paging even on a huge list (tested with ~7k torrents), also on a mobile device.

It is mainly focused on remote controlling the download list instead of trying to replicate each and every feature of the desktop application.

If you want to discuss or get support, [here's](https://plus.google.com/communities/102445612191587383590) the Google Community.

Installation
============

Download latest webui.zip from the [releases](../../releases) tab and copy it in the uTorrent directory. If you want to preserve the official version (which is included in the package anyway), rename the existing webui.zip instead of overwriting.

Mobile friendly
============

From a mobile device, you can pin the application (from the browser, select "Add to homescreen") and get a nice icon which will open in fullscreen with your favourite uTorrent webui ;) .

Self "Updating"
============

If you point to /gui/latest.html instead of the usual /gui, you will get the latest version as soon as it is released, without having to download and replace the webui.zip: the browser downloads the latest version for you, without touching the uTorrent install.
There's a bug, you'll see the "offline" version number in the header instead of the loaded one, but the loaded version is correctly the latest one.

Demo
====
If you want to see it in action, you can test it on the [demo page](http://psychowood.github.io/ng-torrent-ui/dist/demo/).
It's just a demo with a randomly generated download queue, without a real backend. You can play with the frontend, just don't expect the downloads to change status or to complete :)

I feel brave, but I still need the old one!
===========================================

Just in case you don't feel comfortable enough to completely leave the old way, or you are used to some features you don't want to leave (yet ;) ), the classic WebUI, v0.388 (latest version found in the official uTorrent forum) is embedded. It can be reached at _/gui/classic/index.html_ and is also linked in the 'About' tab.

Development status
==================

## Notes

Current version is developed and tested on the latest version of Chrome with μTorrent 2.2.1 (build 25302), and tested for the main functionalities also on the current μTorrent version, 3.4.2. At a later time (possibly) other torrent applications will be supported.

If, for dev purposes, you want to test the app from sources without installing in uTorrent, you need to run

```bash
grunt serve --torrent-host=localhost --torrent-port=8055
```
replacing 'localhost' and '8055' with your utorrent hostname and port.


## Translations

I managed to get many of the ui texts from the original uTorrent WebUI, this means that most of the interface is available in the following languages:

 - Albanian
 - Arabic
 - Belarusian
 - Bosnian
 - Bulgarian
 - Catalan
 - Chinese (Simplified)
 - Chinese (Traditional)
 - Czech
 - Danish
 - Dutch
 - English
 - Estonian
 - Finnish
 - French
 - Frisian
 - Gaeilge
 - Galician
 - Georgian
 - German
 - Greek
 - Hebrew
 - Hungarian
 - Icelandic
 - Italian
 - Japanese
 - Korean
 - Latvian
 - Lithuanian
 - Norwegian
 - Norwegian Nynorsk
 - Polish
 - Portuguese (Brazil)
 - Portuguese (Portugal)
 - Romanian
 - Russian
 - Serbian (Cyrillic)
 - Slovak
 - Slovenian
 - Spanish
 - Swedish
 - Taiwan
 - Thai
 - Turkish
 - Ukrainian
 - Valencian
 - Vietnamese

There are parts not translated yet, and I'll need help because I don't speak nor write most them (except for italian and english). If you think you can help, contact me.

## Release History

### v0.5.0
- [x] Added preference to prevent filename automatic filtering of separators

### v0.4.5
- [x] Added "Favorites" torrents: define a set of tags that, will highlight all matching torrents. Define tags by tapping on the star or going into Preferences. Favorites are saved in cookies.
- [x] Revised preferences section (ng-torrent-ui, uTorrent, Advanced)
- [x] Added "Clear all filters" button
- [x] Show applied "label" and "status" filter
- [x] Updated dependencies

### v0.4.0
- [x] Added "Preferences" tab to view and edit uTorrent settings
- [x] Added support for homescreen pinning (browser menu -> add to HomeScreen on mobile) with dedicated icon and fullscreen view
- [x] Added 'No label' filter
- [x] Added 'Status: error' filter
- [x] Fix for uTorrent bad character handling (caused crash of both ng-torrent-un and official WebUI)
- [x] Prevent text highlighting when selecting on grid

### v0.3.4
- [x] Added 'availability' in grid (in seeds/peers column) and details dialog
- [x] Added 'added on' in grid and details dialog (uTorrent 3+)
- [x] Added 'completed on' in details dialog (uTorrent 3+)
- [x] Added 'save as' (download location) in details dialog (uTorrent 3+)
- [x] Better grid auto-height handling
- [x] Fixed minor typos

### v0.3.3
- [x] Added selection for download location when adding a torrent (needs uTorrent 3+)

### v0.3.2
- [x] Better responsive support (almost complete rewrite of the toolbar), support for multiple resolutions and fit longer texts (e.g. Russian translations)
- [x] Added tooltips for action buttons
- [x] Changed label presentation: added colored tag icon, works well for less than 16 labels. Label color is assigned based on torrent quantity, to preserve color between different sessions
- [x] Added self-updating url: point yout browser to /gui/latest.html to always get the latest version without having to update the webui.zip file! (BETA); needs internet access from the browser to work.

### v0.3.1
- [x] Added: Server version in header
- [x] Fixed: Language not recognized before first set
- [x] Support for multi-value strings (caused problems with russian language) [thanks *lukas-by*]
- [x] Fixed: notification for newer version after update

### v0.3.0
- [x] Added: Inherited translations from uTorrent resource files. Jump to 47 supported languages :) (Various strings missing, I'll need help from the community to complete the translations).

### v0.2.9
- [x] Added: Report issue via mail
- [x] Added: Online new version check (using GitHub API to check releases)

### v0.2.8
- [x] Added: Report issue in the About tab
- [x] Fixed: Touch not recognized on mobile devices in torrent details modal
- [x] Added: Remove label
- [x] Added: Create new label
- [x] Fixed: Set label for multiple torrents
- [x] Added: upload of torrent files (not supported for uTorrent 2.X)
- [x] Added: close button in torrent details modal
- [x] First tests with the current uTorrent (v3.4.2 build 37594)

### v0.2.7
- [x] Added: change file priority and files filter in torrent details
- [x] Added: Global speed tracking
- [x] Better responsive reflowing

### v0.2.6
- [x] Embedded the classic WebUI, v0.388, the latest version found in the official uTorrent forum. It can be reached at _/gui/classic/index.html_ and is also linked in the 'About' tab), just in case you don't feel comfortable enough to completely leave the old way :) .
- [x] Added demo build process
- [x] GZipped files in the uTorrent release (less than half of the previous archive size)
- [x] Minor graphical glitches fixed

### v0.2.5
- [x] Show primary label the grid
- [x] Show seeds/peers in grid
- [x] Show torrent details with properties and files list
- [x] Fixed name filter with spaces
- [x] Fixed non working actions (queue up/down, recheck)

### v0.2.0
- [x] Got a brand new logo. Deserved a version bump. :)
- [x] Reference to G+ page
- [x] Multiple selection with Shift key modifier
- [X] New filter: Show only selected torrents
- [X] New filter: Filter by status (downloading, seeding, paused, ...)
- [x] L33t filter rewrite
- [x] Angular version upgraded to 1.3.6
- [x] Pruned unused dependencies

### v0.1.0
- [x] Generinc information os download status (progress, size, current speed, queue position)
- [x] Reponsive design (mobile and desktop views)
- [x] Custimizable auto-refresh time
- [x] Non-paged list (virtual scrolling, on-demand rendering of a row, supports for high number of rows with limited impact)
- [x] Name filtering with l33t support ('arrow' finds both 'ARROW' and '4RR0W')
- [x] Label filtering
- [x] Basic name cleanup (replacement of . and _ with spaces, moving of [...] tags after the name
- [x] Basic operations (start/pause/stop/force/remove/queue moving)
- [x] Multiple selection of torrents, even on different searches, to apply batch operations
- [x] Add torrent by url (http and magnet)
- [x] Ctrl/Cmd multiple selection
- [x] Sortable headers (queue, name, downloaded %, size, up speed, down speed)
- [x] Travis builds integration

## To dos

Not in a specific order.

- [ ] Confirmation dialogs
- [ ] Test with different browsers
- [ ] Unit tests
- [ ] Better error handling
- [ ] Apply multiple name filters at the same time
- [ ] Add a default action on each torrent in list (eg. If stopped -> start, if started -> pause, if pause -> resume, and so on)
- [ ] Local storage (saving searches and webui settings)
- [ ] Scene name parsing, estraction of tags (file format, languages, etc)
- [ ] Use a fake-torrent in list to save client settings to the server
- [ ] Documentation
- [ ] Generalize API to allow the usage with different torrent applications
- [ ] Code cleanup
- [ ] Desktop notifications for supported browsers
- [ ] Embed search engines
- [ ] Support for multiple labels per torrent (undocumented API?)
- [ ] Find a more 'personal' name
- [ ] Any ideas? Tell me :)

Various
===========

The base project was scaffolded with [Yeoman](http://yeoman.io).

### Privacy
The main page includes a Google Analytics tag. It is just a counter for statistic usage (nothing else is tracked, neither the downloads nor anything else). The tag can be easily removed from index.html, if you believe this could be a problem just let me know.

### Donations
This is developed during my free time so, if you are willing to offer me a beer and support this project, you are welcome :)
You can donate with paypal in [eur](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=84LH348H27CN6) or [usd](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7Z88PRASGESGQ).

Screenshots
===========

The following screenshots are partially outdated: the look'n'feel is quite similar but are not 100% accurate and missing some functionalities.

### High res view (>1600px)
![High res view](screenshots/desktop-xl.png?raw=true "High res view")

### Standard view (>768px <1600px)
![Standard view](screenshots/desktop.png?raw=true "Standard view")

### Mobile view (<768px)
![Mobile view](screenshots/mobile.png?raw=true "Mobile view")

### Torrent details - standard view (>768px <1600px)
![Torrent details - standard view](screenshots/desktop-detail.png?raw=true "Torrent details - standard view")

### Torrent details - mobile view (<768px)
![Torrent details - mobile view](screenshots/mobile-detail.png?raw=true "Torrent details - mobile view")
