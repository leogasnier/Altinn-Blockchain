import {BootScriptAsync} from '@mean-expert/boot-script';
import {LoggerFactory} from '../../domain/utils/logger/LoggerFactory';
import {Container} from 'typedi';
import {LoggerInstance} from 'winston';

@BootScriptAsync()
class Boot01Root {
  private logger: LoggerInstance;

  public constructor(private app: any, next: Function) {
    this.logger  = Container.get(LoggerFactory).get('Boot01:Root');
    const router = app.loopback.Router();
    router.get('/', app.loopback.status());
    app.use(router);

    next();
  }
}

export = Boot01Root;
