import {Settings} from './settings.interface';

export class StarterPlanConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        url:                           'http://composer:3000/api',
        profile:                       'defaultProfile',
        network:                       'altinn-network',
        channel:                       'defaultchannel',
        channelName:                   'altinn-network',
        namespace:                     'org.altinn',
        composerDefaultCardsDirectory: '././resources/connectionProfiles/cards',
        networkAdminName:              'admin',
        defaultModelFilePath:          '././resources/composerModels',
        defaultModelFileName:          'org.altinn.cto',
        connectionOptions:             {
          wallet: {
            type:    'composer-wallet-filesystem',
            options: {
              storePath: '././resources/connectionProfiles'
            }
          }
        }
      },
      host:         '0.0.0.0',
      port:         '8080',
      serverSecret: 'sUp4hS3cr37kE9c0D3'
    };
  }
}
