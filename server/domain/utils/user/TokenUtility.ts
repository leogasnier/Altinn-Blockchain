export class TokenUtility {
  public static app: any;

  public constructor(app: any) {
    TokenUtility.app = app;
  }

  public setCurrentUser(model: any): void {
    model.beforeRemote('**', this.retrieveUserFromToken);
  }

  private async retrieveUserFromToken(ctx: any, empty: any, next: Function): Promise<void> {
    if (!ctx.req.accessToken) {
      throw new Error('TokenUtility: Access token not found!');
    }

    try {
      const accessToken = ctx.req.accessToken;
      const userID      = accessToken.userId;

      let user         = await TokenUtility.app.models.LoopbackUser.findById(userID);
      let composerUser = await TokenUtility.app.models.ComposerParticipant.findById(userID);

      if (!ctx.args.options) {
        ctx.args.options = {};
      }

      ctx.args.options.currentUser         = user;
      ctx.args.options.currentComposerUser = composerUser;
    } catch (error) {
      next(error);
    }
  }
}
