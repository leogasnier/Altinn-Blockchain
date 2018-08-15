import * as loopback from 'loopback';
import * as boot from 'loopback-boot';
import {LoggerFactory} from '../domain/utils/logger/LoggerFactory';
import {Container} from 'typedi';
import {Config} from '../domain/config';
import {LoggerInstance} from 'winston';

const app: any = module.exports = loopback();
const loggerFactory: LoggerFactory = new LoggerFactory(Config.settings.winston, Config.settings.morgan);
const logger: LoggerInstance       = loggerFactory.get('Loopback');

Container.set(LoggerFactory, loggerFactory);

app.start = () => {
  // start the web server
  return app.listen(() => {
    app.emit('started');
    const baseUrl = app.get('url').replace(/\/$/, '');
    logger.info('Web server listening at: %s', baseUrl);

    if (app.get('loopback-component-explorer')) {
      const explorerPath = app.get('loopback-component-explorer').mountPath;

      logger.info('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, ((bootError) => {
  if (bootError) {
    logger.error('Error during boot', bootError);

    throw bootError;
  }

  if (require.main === module) {
    // start the server if `$ node server.js`
    app.start();
  }
}));
