'use strict';

const config = require('./config');

const dataSources = {
  'db': {
    'name': 'db',
    'connector': 'memory',
    'file':'./db.json'
  }
  // 'private-db': {
  //   'name': 'private-db',
  //   'connector': 'couch',
  //   'db': config.couchdb.database,
  //   'host': config.couchdb.host,
  //   'url': config.couchdb.host + ':' + config.couchdb.port,
  //   'port': config.couchdb.port,
  //   'protocol': 'http',
  // },
};

module.exports = dataSources;
