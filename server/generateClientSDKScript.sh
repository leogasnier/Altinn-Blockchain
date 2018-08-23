#!/usr/bin/env bash -ex

rm -r dist/*
tsc
cp -R resources dist/resources
cp -R *.json dist/
cp -R *.js dist/
cp -R server/*.json dist/server/
cp -R server/*.js dist/server/
cp -R common/models/*.json dist/common/models/
rm ./dist/server/boot/boot05-add-users.js
rm ./dist/server/boot/boot05-add-users.js.map
rm ./dist/server/boot/boot99-final-app-start.js
rm ./dist/server/boot/boot99-final-app-start.js.map
docker exec -ti $(docker ps | grep server_1 | cut -d " " -f 1) ./node_modules/.bin/lb-sdk ./dist/server/server ../client-sdk -i disabled --wipe enabled