import * as winston from 'winston';
import {LoggerInstance, LoggerOptions} from 'winston';
import * as morgan from 'morgan';
import * as debug from 'debug';
import {IDebugger} from 'debug';

export class LoggerFactory {
  private debug: IDebugger                                 = debug('api:logger');
  private static loggers: { [id: string]: LoggerInstance } = {};

  public constructor(private winstonOptions?: LoggerOptions,
                     private morganOptions?: morgan.Options) {
    this.debug('created loggerFactory. Winston: %O. Morgan: %O.', winstonOptions, morganOptions);
  }

  /**
   * Creates or returns an existing instance of a logger that logs with the provided (optional) prefix.
   * @param prefix
   * @returns {LoggerInstance}
   */
  public get(prefix?: string): LoggerInstance {
    prefix = prefix || 'default';
    this.debug(`getting logger with prefix '${prefix}'`);
    if (!LoggerFactory.loggers[prefix]) {
      const logger = new winston.Logger( {
        level: 'verbose',
        transports: [
          new winston.transports.Console({
            timestamp: true,
            json: false,
            colorize: true,
            prettyPrint: true
          })
        ]
      });
      if (prefix !== 'default') {
        logger.filters.push((level: string, msg: string, meta: any): string => `[${prefix}] ${msg}`);
      }
      LoggerFactory.loggers[prefix] = logger;
      this.debug('created');
    }

    return LoggerFactory.loggers[prefix];
  }
}
