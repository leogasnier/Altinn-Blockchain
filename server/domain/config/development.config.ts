import {Settings} from './settings.interface';

export class DevelopmentConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        url:                           'http://composer:3000/api',
        profile:                       'defaultProfile',
        network:                       'altinn-network',
        channel:                       'composerchannel',
        channelName:                   'hlfv1',
        namespace:                     'org.altinn',
        composerDefaultCardsDirectory: '/root/.composer/cards',
        networkAdminName:              'networkadmin',
        defaultModelFilePath:          '/root/.composer-models/',
        defaultModelFileName:          'org.altinn.cto',
        connectionOptions:             {
          wallet: {
            type:    'composer-wallet-filesystem',
            options: {
              storePath: '/root/.composer/cards'
            }
          }
        }
      },
      host:         '0.0.0.0',
      serverSecret: 'sUp4hS3cr37kE9c0D3',
      privateDB:    {
        host: 'loopback-private-db',
        port: '5984'
      }
    };
  }
}
