import {BootScriptAsync} from '@mean-expert/boot-script';

@BootScriptAsync()
class Boot99FinalAppStart {
  public constructor(private app: any, next: Function) {
    app.start();

    next();
  }
}

export = Boot99FinalAppStart;
