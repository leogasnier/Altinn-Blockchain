import {Model} from '@mean-expert/model';
import {LoggerInstance} from 'winston';
import {TokenUtility} from '../../domain/utils/user/TokenUtility';
import {LoggerFactory} from '../../domain/utils/logger';
import {BusinessNetworkHandler} from '../../domain/composer/composerConnections/BusinessNetworkHandler';
import {TransactionHandler} from '../../domain/composer/transactionHandler/TransactionHandler';
import {TransactionType} from '../../domain/composer/types/TransactionType';
import {QueryType} from '../../domain/composer/types/QueryType';
import {Container} from 'typedi';

@Model()
class RegistryOfShareHolders {
  private logger: LoggerInstance;

  public constructor(public model: any) {
    Container.get(TokenUtility).setCurrentUser(model);
    this.logger = Container.get(LoggerFactory).get('RegistryOfShareHolders');

    this.model.createRegistryOfShareHolders   = this.createRegistryOfShareHolders;
    this.model.getAllRegistriesOfShareHolders = this.getAllRegistriesOfShareHolders;
  }

  public async getAllRegistriesOfShareHolders(options: any): Promise<any> {
    try {
      const composerParticipantCard = options.currentComposerUser.cardName;
      const businessNetworkHandler  = new BusinessNetworkHandler();
      const transactionHandler      = new TransactionHandler(businessNetworkHandler);

      return await transactionHandler.query(composerParticipantCard, QueryType.getAllRegistriesOfShareHolders);
    } catch (error) {
      this.logger.error(error);

      return Promise.reject(error);
    }
  }

  public async createRegistryOfShareHolders(options: any, data: any): Promise<void> {
    try {
      const composerParticipantCard = options.currentComposerUser.cardName;
      const businessNetworkHandler  = new BusinessNetworkHandler();
      const transactionHandler      = new TransactionHandler(businessNetworkHandler);

      await transactionHandler.invoke(
        composerParticipantCard,
        TransactionType.createRegistryOfShareHolders,
        data
      );
    } catch (error) {
      console.log(error);

      return Promise.reject(error);
    }
  }
}

module.exports = RegistryOfShareHolders;
