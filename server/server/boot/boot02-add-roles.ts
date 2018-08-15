import {BootScriptAsync} from '@mean-expert/boot-script';
import {LoggerInstance} from 'winston';
import {Container} from 'typedi';
import {LoggerFactory} from '../../domain/utils/logger';

@BootScriptAsync()
class Boot02AddRoles {
  private roles: any = require('../../resources/testdata/roles.json').roles;
  private logger: LoggerInstance;

  public constructor(private app: any, next: Function) {
    this.logger                  = Container.get(LoggerFactory).get('Boot02:AddRoles');
    const UserRole               = app.models.UserRole;
    let promises: Promise<any>[] = [];

    for (let role of this.roles) {
      this.roleExists(role).then((exists) => {
        if (!exists) {
          promises.push(UserRole.create({
            name: role.name
          }));
        }
      });
    }

    Promise.all(promises).then(() => {
      next();
    }).catch((error) => {
        this.logger.error(error);
      }
    );
  }

  private async roleExists(role: any): Promise<boolean> {
    let foundRole = await this.app.models.UserRole.findOne({where: {name: role.name}});

    return foundRole ? true : false;
  }
}

export = Boot02AddRoles;
