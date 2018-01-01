
player.min.js: ../aplows.io/client/player.js Makefile
#	uglifyjs -c drop_console,passes=3 -m -o player.min.js player.js
	uglifyjs -c drop_console -m -o player.min.js ../aplows.io/client/player.js
js.cookie.js: ../aplows.io/client/js.cookie.js
	/bin/cp -p ../aplows.io/client/js.cookie.js .

index.html: ../aplows.io/client/index.html
	cat ../aplows.io/client/index.html |sed -e 's/\/player.js/\/player.min.js/' |sed -e 's/\/client\//\//' >index.html

favi.png: ../aplows.io/client/favi.png
	/bin/cp -p ../aplows.io/client/favi.png .
virus-background.png: ../aplows.io/client/virus_background.png
	/bin/cp -p ../aplows.io/client/virus_background.png .

assets: ../aplows.io/client/img ../aplows.io/client/audio
	/bin/rm -rf img; /bin/cp -rp ../aplows.io/client/img .
	/bin/rm -rf audio; /bin/cp -rp ../aplows.io/client/audio .

all: player.min.js js.cookie.js index.html assets favi.png virus-background.png

deploy: all
#	git add .
#	git commit -a -m "Test";
#	git push origin master
