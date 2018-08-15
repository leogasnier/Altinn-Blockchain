#!/bin/bash
docker-compose stop
docker-compose rm -f
docker rm -f -v $(docker ps -aq) 2>/dev/null;
docker rmi $(docker images -qf "dangling=true") 2>/dev/null;
docker rmi $(docker images | grep "dev-" | awk "{print $1}") 2>/dev/null;
docker rmi $(docker images | grep "^<none>" | awk "{print $3}") 2>/dev/null;
if [ "$(uname)" == "Darwin" ]; then
  rm -rf $(pwd)/composer/resources/.composer/*
  rm -rf $(pwd)/composer/resources/cards/*
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
  sudo rm -rf $(pwd)/composnpmer/resources/.composer/*
  rm -rf $(pwd)/composer/resources/cards/*
fi
exit 0
