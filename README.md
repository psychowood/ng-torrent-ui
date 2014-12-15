[![Build Status](https://travis-ci.org/psychowood/ng-torrent-ui.svg?branch=master)](https://travis-ci.org/psychowood/ng-torrent-ui)
![Logo](app/favicon.png?raw=true "Logo") ng-torrent-ui
=============

ng-torrent-ui is born as a replacement for the uTorrent WebUI, focusing on download management and responsiveness instead of covering each and every functionality.
The use of virtual scrolling removes the need for paging even on a huge list (tested with ~7k torrents), also on a mobile device.

It is mainly focused on remote controlling the download list instead of trying to replicate each and every feature of the desktop application.

If you want to discuss or get support, [here's](https://plus.google.com/communities/102445612191587383590) the Google Community.

Installation
============

Download latest webui.zip from the [releases](../../releases) tab and copy it in the uTorrent directory. If you want to preserve the official version, rename the existing webui.zip instead of overwriting.

Development status
==================

## Notes

Current version is developed on the latest version of Chrome, with μTorrent 2.2.1 (build 25302). Newer uTorrent versions will be supported at a later time, as for (possibly) other torrent applications.

If, for dev purposes, you want to test the app from sources without installing in uTorrent, you need to run

```bash
grunt serve --torrent-host=localhost --torrent-port=8055
```
replacing 'hostname' and '8055' with your utorrent hostname and port.

## Release History

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

- [ ] New versions check
- [ ] Confirmation dialogs
- [ ] Test with different browsers
- [ ] Unit tests
- [ ] Settings page
- [ ] Better error handling
- [ ] Changing priorities of files in a torrent
- [ ] Apply multiple name filters at the same time
- [ ] Add a default action on each torrent in list (eg. If stopped -> start, if started -> pause, if pause -> resume, and so on)
- [ ] Local storage (saving searches and custom settings)
- [ ] Scene name parsing, estraction of tags (file format, languages, etc)
- [ ] Use a fake-torrent in list to save client settings
- [ ] Documentation
- [ ] Generalize API to allow the usage with different torrent applications
- [ ] Code cleanup
- [ ] Desktop notifications for supported browsers
- [ ] Toolbar auto fit width
- [ ] Find a cool name
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

### Desktop view
![Desktop view](screenshots/desktop.png?raw=true "Desktop view")

### Responsive view
![Responsive view](screenshots/responsive.png?raw=true "Responsive view")
