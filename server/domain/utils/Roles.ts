import * as app from '../../server/server';
import {UserRoleType} from '../roles/types/UserRoleType';

export class Roles {
  private app: any;
  private userId: string;

  public constructor(userId: string) {
    this.app    = app;
    this.userId = userId;
  }

  public async add(roleName: UserRoleType): Promise<void> {
    const userRole = await this.app.models.UserRole.findOne({where: {name: roleName}});

    await userRole.principals.create({
      principalType: this.app.models.UserRoleMapping.USER,
      principalId:   this.userId,
    });
  }

  public async remove(roleName: UserRoleType): Promise<void> {
    const role        = await this.app.models.UserRole.findOne({where: {name: roleName}});
    const roleMapping = await this.app.models.UserRoleMapping.findOne({
      where: {
        name:        roleName,
        principalId: this.userId
      }
    });
    const principal   = await role.principals.findById(roleMapping.roleId);

    return principal.destroy();
  }
}
