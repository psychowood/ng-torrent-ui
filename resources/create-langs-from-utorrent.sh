cd utorrent-langs
mv _.js _.js.exluded
or i in *.js; do echo ';var a = JSON.stringify(LANG_STR); console.log(a)' | cat $i - | node | sed 's/","/",@"/g' | tr @ '\n' > ../../app/langs/utorrent/$i.json; done
mv _.js.exluded _.js
cp _.js ../../app/langs/utorrent/_.js
cd ..