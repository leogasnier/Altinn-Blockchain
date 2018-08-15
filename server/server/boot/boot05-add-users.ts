import {BootScriptAsync} from '@mean-expert/boot-script';
import {Roles} from '../../domain/utils/Roles';
import {LoggerInstance} from 'winston';
import {Container} from 'typedi';
import {LoggerFactory} from '../../domain/utils/logger';

@BootScriptAsync()
class Boot05AddUsers {
  private users: any = require('../../resources/testdata/users.json').users;
  private logger: LoggerInstance;
  private loopbackUser: any;

  public constructor(private app: any, next: Function) {
    this.logger       = Container.get(LoggerFactory).get('Boot05:AddUsers');
    this.loopbackUser = app.models.LoopbackUser;

    this.createAllUsers().then(
      () => {
        this.logger.info('All users successfully created!');

        next();
      }
    ).catch((error) => {
        this.logger.error('Some error occurred when creating the users', error);
      }
    );
  }

  private async createAllUsers(): Promise<void> {
    for (let user of this.users) {
      if (!await this.userExists(user)) {
        await this.createUser(user);
      }
    }
  }

  private async createUser(user: any): Promise<void> {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    try {
      await this.loopbackUser.create(user);
      const roleUtil = new Roles(user.ID);
      for (let role of user.roles) {
        await roleUtil.add(role);
      }
    } catch (error) {
      this.logger.error('Retrying to create user ' + user.ID);
      await delay(5000);
      if (!await this.userExists(user)) {
        await this.createUser(user);
      }
    }
  }

  private async userExists(user: any): Promise<boolean> {
    let foundUser = await this.app.models.LoopbackUser.findById(user.ID);

    return !!foundUser;
  }
}

export = Boot05AddUsers;
