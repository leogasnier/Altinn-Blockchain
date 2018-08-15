import {LoopbackUserApi} from '../shared/client-sdk/services/custom/LoopbackUser';
import {UserRoleType} from '../types/UserRoleType';
import {Injectable} from '@angular/core';

@Injectable()
export class UserUtility {
  public constructor(private authenticationService: LoopbackUserApi) {
  }

  public userHasRole(role: UserRoleType): boolean {
    if (this.authenticationService.isAuthenticated()) {
      const user = this.authenticationService.getCachedCurrent();

      if (!Array.isArray(user.roles)) {
        return false;
      }

      for (const userRole of user.roles) {
        if (userRole === role) {
          return true;
        }
      }
    }
    return false;
  }

  public getUserRole(): string {
    if (this.authenticationService.isAuthenticated()) {
      return this.authenticationService.getCachedCurrent().participantClass;
    }
    return '';
  }
}
