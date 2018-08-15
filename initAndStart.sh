#!/usr/bin/env bash -ex

if [ "$1" = "prod" ]; then
  prodArg="-f docker-compose-prod.yml"
else
  prodArg=""
fi

rm -rf $(pwd)/composer/resources/.composer/*
rm -rf ./composer/resources/cards/*
docker-compose -f docker-compose.yml ${prodArg} up --force-recreate -d
sleep 10;
curl -X PUT http://localhost:5985/_global_changes/
curl -X PUT http://localhost:5985/_metadata/
curl -X PUT http://localhost:5985/_replicator/
curl -X PUT http://localhost:5985/_users/
curl -X PUT http://localhost:5985/loopback-db/