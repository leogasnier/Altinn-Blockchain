'use strict';

module.exports = {
  couchdb: {
    host: process.env.COUCHDB_HOST,
    port: process.env.COUCHDB_PORT,
    database: process.env.COUCHDB_DATABASE,
    user: process.env.COUCHDB_USER,
    password: process.env.COUCHDB_PASSWORD,
  },
};
