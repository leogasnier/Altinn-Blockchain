import {BootScriptAsync} from '@mean-expert/boot-script';
import {LoggerInstance} from 'winston';
import {Container} from 'typedi';
import {LoggerFactory} from '../../domain/utils/logger';
import {ParticipantHandler} from '../../domain/composer/participants/ParticipantHandler';

@BootScriptAsync()
class Boot04CreateAdminCardFolder {
  private logger: LoggerInstance;
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  public constructor(private app: any, next: Function) {
    Container.set(ParticipantHandler, new ParticipantHandler());
    this.logger = Container.get(LoggerFactory).get('Boot04:CreateAdminCardFolders');

    this.createAdminCardFolders().then(
      () => {
        next();
      });
  }

  private async createAdminCardFolders(): Promise<void> {
    const participantHandler = new ParticipantHandler();

    try {
      await participantHandler.createNetworkAdminCardFolderFromArchive();
      await this.delay(5000);
    } catch (error) {
      this.logger.error('Retrying to create Admin Card Folders');
      await this.delay(5000);
      await this.createAdminCardFolders();
    }
  }
}

export = Boot04CreateAdminCardFolder;
