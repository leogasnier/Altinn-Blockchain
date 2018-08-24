import {Model} from '@mean-expert/model';
import {LoggerInstance} from 'winston';
import {TokenUtility} from '../../domain/utils/user/TokenUtility';
import {LoggerFactory} from '../../domain/utils/logger';
import {BusinessNetworkHandler} from '../../domain/composer/composerConnections/BusinessNetworkHandler';
import {TransactionHandler} from '../../domain/composer/transactionHandler/TransactionHandler';
import {QueryType} from '../../domain/composer/types/QueryType';
import {Container} from 'typedi';

@Model()
class AltinnParticipant {
  private logger: LoggerInstance;

  public constructor(public model: any) {
    Container.get(TokenUtility).setCurrentUser(model);
    this.logger = Container.get(LoggerFactory).get('Stock');

    this.model.getBusinessRegistry   = this.getBusinessRegistry;
    this.model.getChairmanOfTheBoard = this.getChairmanOfTheBoard;
    this.model.getStockOwner         = this.getStockOwner;
  }

  public async getBusinessRegistry(options: any, businessRegistryID: string): Promise<any> {
    try {
      const composerParticipantCard = options.currentComposerUser.cardName;
      const businessNetworkHandler  = new BusinessNetworkHandler();
      const transactionHandler      = new TransactionHandler(businessNetworkHandler);

      return await transactionHandler.query(composerParticipantCard, QueryType.getBusinessRegistry, {
        userID: businessRegistryID
      });
    } catch (error) {
      this.logger.error(error);

      return error;
    }
  }

  public async getChairmanOfTheBoard(options: any, chairmanOfTheBoardID: string): Promise<any> {
    try {
      const composerParticipantCard = options.currentComposerUser.cardName;
      const businessNetworkHandler  = new BusinessNetworkHandler();
      const transactionHandler      = new TransactionHandler(businessNetworkHandler);

      return await transactionHandler.query(composerParticipantCard, QueryType.getChairmanOfTheBoard, {
        userID: chairmanOfTheBoardID
      });
    } catch (error) {
      this.logger.error(error);

      return error;
    }
  }

  public async getStockOwner(options: any, stockOwnerID: string): Promise<any> {
    try {
      const composerParticipantCard = options.currentComposerUser.cardName;
      const businessNetworkHandler  = new BusinessNetworkHandler();
      const transactionHandler      = new TransactionHandler(businessNetworkHandler);

      return await transactionHandler.query(composerParticipantCard, QueryType.getStockOwner, {
        userID: stockOwnerID
      });
    } catch (error) {
      this.logger.error(error);

      return error;
    }
  }
}

module.exports = AltinnParticipant;
