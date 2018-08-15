import {BootScriptAsync} from '@mean-expert/boot-script';
import * as loopback from 'loopback';
import {TokenUtility} from '../../domain/utils/user/TokenUtility';
import {Container} from 'typedi';

@BootScriptAsync()
class Boot00EnableAuthentication {
  public constructor(private app: any, next: Function) {
    app.enableAuth();
    app.use(loopback.token({
      model:              app.models.AccessToken,
      cookies:            ['access_token', '$LoopBackSDK$id'],
      headers:            ['access_token', 'X-Access-Token', 'Authorization'],
      params:             ['access_token'],
      currentUserLiteral: 'me'
    }));

    Container.set(TokenUtility, new TokenUtility(app));

    next();
  }
}

export = Boot00EnableAuthentication;
