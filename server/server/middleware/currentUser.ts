
const setCurrentUser = () => {
  return (req: any, res: any, next: Function): any => {
    req.app.remotes().before('**', async (ctx, next) => {
      try {
        let accessToken = ctx.req.accessToken;
        if (!ctx.req.accessToken) {
          console.log("No access token for this call")
          return next();
        }
        const userID = accessToken.userId;
        let user = await ctx.req.app.models.LoopbackUser.findById(userID);
        let composerUser = await ctx.req.app.models.ComposerParticipant.findById(userID);

        if (!ctx.args.options) {
          ctx.args.options = {};
        }
        ctx.args.options.currentUser = user;
        ctx.args.options.currentComposerUser = composerUser;
        next();
      }
      catch (e) {
        next(e)
      }
    })
    next();
  }
}

export = setCurrentUser;

