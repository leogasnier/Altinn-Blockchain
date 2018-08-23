import {Model} from '@mean-expert/model';

@Model()
class LoopbackUser {
  public constructor(public model: any) {
    this.model.once('attached', () => {
      this.model.observe('before save', this.createComposerUser);
    });
  }

  private createComposerUser(ctx: any, next: any): void {
    if (ctx.instance) {
      ctx.instance.composerParticipant.create({
        userID:               ctx.instance.ID,
        firstName:            ctx.instance.firstName,
        lastName:             ctx.instance.lastName,
        org:                  ctx.instance.companyId,
        socialSecurityNumber: ctx.instance.socialSecurityNumber,
        participantClass:     ctx.instance.participantClass,
      }).then(() => {
        next();
      });
    } else {
      next();
    }
  }
}

module.exports = LoopbackUser;
