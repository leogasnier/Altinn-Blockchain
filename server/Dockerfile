FROM node:8.9.4-alpine

RUN apk --no-cache add git python make g++ libc6-compat gcc

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app

COPY package.json package.json
RUN npm install --loglevel error
RUN npm cache clear --force

COPY . .
COPY resources/connectionProfiles /root/.composer-connection-profiles