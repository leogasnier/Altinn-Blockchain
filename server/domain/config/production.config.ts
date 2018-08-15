import {Settings} from './settings.interface';

export class ProductionConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        url:                           'http://159.8.76.83:31090/api',
        profile:                       'production',
        network:                       'altinn-network',
        channel:                       'channel1',
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
      host:         process.env.VCAP_HOST || process.env.HOST || '',
      port:         process.env.VCAP_PORT || process.env.PORT || '',
      serverSecret: 'sUp4hS3cr37kE9c0D3',
      privateDB:    {
        host: 'couchdb-private',
        port: '5984'
      }
    };
  }
}
