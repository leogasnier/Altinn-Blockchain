import {LoggerOptions} from 'winston';
import {Options} from 'morgan';

export interface Settings {
  apiPath?: string;
  composer: {
    url: string;
    channel: string;
    channelName: string;
    profile: string;
    network?: string;
    connectionOptions: any;
    namespace: string;
    composerDefaultCardsDirectory: string;
    networkAdminName: string;
    defaultModelFilePath: string;
    defaultModelFileName: string;
  };
  env?: string;
  host: string;
  morgan?: Options;
  port?: number | string;
  winston?: LoggerOptions;
  serverSecret: string;
  privateDB?: {
    host: string,
    port: string
  };
}
