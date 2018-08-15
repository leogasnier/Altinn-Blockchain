FROM node:8.9.4-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package.json
RUN npm install --loglevel error
RUN npm cache clear --force

COPY . .

EXPOSE 4200
EXPOSE 49153
