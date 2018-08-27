import {Model} from '@mean-expert/model';
import {ParticipantHandler} from '../../domain/composer/participants/ParticipantHandler';
import {Container} from 'typedi';
import {ParticipantTypeMap} from '../../domain/composer/participants/ParticipantTypeMap';
import {Config} from '../../domain/config';

@Model()
class ComposerParticipant {
  public constructor(public model: any) {
    this.model.once('attached', () => {
      this.model.observe('before save', this.createComposerUser);
    });
  }

  private async createComposerUser(ctx: any, next: any): Promise<void> {
    const participantHandler = Container.get(ParticipantHandler);
    try {
      await participantHandler.createNewParticipant(
        ctx.instance,
        ParticipantTypeMap.getParticipantTypeByParticipantClass(ctx.instance.participantClass)
      );

      ctx.instance.cardName = ctx.instance.ID + '@' + Config.settings.composer.channelName;
    } catch (error) {
      return error;
    }

    next();
  }
}

module.exports = ComposerParticipant;
