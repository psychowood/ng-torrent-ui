ng-torrent-ui
=============

ng-torrent-ui is born as a replacement for the uTorrent WebUI, focusing on download management and responsiveness instead of covering each and every functionality.
The use of virtual scrolling removes the need for paging even on a hige list (tested with ~7k torrents), also on a mobile device.

It is mainly focused on remote controlling the download list instead of trying to replicate each and every feature of the desktop application.

Development status
=======

### Notes

Current version is developed on μTorrent 2.2.1 (build 25302) with the latest version of Chrome, since it is not working well with the official WebUI and it is still very used in the community (possibly more than the latest version). Newer versions will be supported at a later time.

Project created with [Yeoman](http://yeoman.io).

### Supported features and to dos

Not in a specific order.

- [x] Generinc information os download status (progress, size, current speed, queue position)
- [x] Custimizable auto-refresh time
- [x] Non-paged list (virtual scrolling, on-demand rendering of a row, supports for high number of rows with limited impact)
- [x] Name filtering with l33t support ('arrow' finds both 'ARROW' and '4RR0W')
- [x] Label filtering
- [x] Basic name cleanup (replacement of . and _ with spaces, moving of [...] tags after the name
- [x] Basic operations (start/pause/stop/force/remove/queue moving)
- [x] Multiple selection of torrents, even on different searches, to apply batch operations
- [x] Add torrent by url (http and magnet)

- [ ] Confirmation dialogs
- [ ] Test with different browsers
- [ ] Unit tests
- [ ] Travis builds integration
- [ ] Settings page
- [ ] Better error handling
- [ ] Show torrent details and properties
- [ ] Changing priorities of files in a torrent
- [ ] Show labels and tags of a torrent
- [ ] Show seeds/peers of a torrent
- [ ] Show only selected torrents
- [ ] Add a default action on each torrent in list (eg. If stopped -> start, if started -> pause, if pause -> resume, and so on)
- [ ] Local storage (saving searches and custom settings)
- [ ] Scene name parsing, estraction of tags (file format, languages, etc)
- [ ] Use a fake-torrent in list to save client settings
- [ ] Documentation
- [ ] Generalize API to allow the usage with different torrent applications
- [ ] Any ideas? Tell me :)
