import {Model} from '@mean-expert/model';
import {LoggerInstance} from 'winston';
import {TokenUtility} from '../../domain/utils/user/TokenUtility';
import {LoggerFactory} from '../../domain/utils/logger';
import {BusinessNetworkHandler} from '../../domain/composer/composerConnections/BusinessNetworkHandler';
import {TransactionHandler} from '../../domain/composer/transactionHandler/TransactionHandler';
import {TransactionType} from '../../domain/composer/types/TransactionType';
import {Container} from 'typedi';

@Model()
class Stock {
  private logger: LoggerInstance;

  public constructor(public model: any) {
    Container.get(TokenUtility).setCurrentUser(model);
    this.logger = Container.get(LoggerFactory).get('Stock');

    this.model.distributeStocksToStockOwners = this.distributeStocksToStockOwners;
    this.model.expandCapitalRequest          = this.expandCapitalRequest;
    this.model.expandCapital                 = this.expandCapital;
    this.model.requestPurchase               = this.requestPurchase;
    this.model.respondToPurchaseRequest      = this.respondToPurchaseRequest;
    this.model.processStockSale              = this.processStockSale;
  }

  public async distributeStocksToStockOwners(options: any, data: any): Promise<void> {
    try {
      const composerParticipantCard = options.currentComposerUser.cardName;
      const businessNetworkHandler  = new BusinessNetworkHandler();
      const transactionHandler      = new TransactionHandler(businessNetworkHandler);

      await transactionHandler.invoke(
        composerParticipantCard,
        TransactionType.distributeStocksToStockOwners,
        data
      );
    } catch (error) {
      console.log(error);

      return Promise.reject(error);
    }
  }

  public async expandCapitalRequest(options: any, data: any): Promise<void> {
    try {
      const composerParticipantCard = options.currentComposerUser.cardName;
      const businessNetworkHandler  = new BusinessNetworkHandler();
      const transactionHandler      = new TransactionHandler(businessNetworkHandler);

      await transactionHandler.invoke(
        composerParticipantCard,
        TransactionType.expandCapitalRequest,
        data
      );
    } catch (error) {
      console.log(error);

      return Promise.reject(error);
    }
  }

  public async expandCapital(options: any, data: any): Promise<void> {
    try {
      const composerParticipantCard = options.currentComposerUser.cardName;
      const businessNetworkHandler  = new BusinessNetworkHandler();
      const transactionHandler      = new TransactionHandler(businessNetworkHandler);

      await transactionHandler.invoke(
        composerParticipantCard,
        TransactionType.expandCapital,
        data
      );
    } catch (error) {
      console.log(error);

      return Promise.reject(error);
    }
  }

  public async requestPurchase(options: any, data: any): Promise<void> {
    try {
      const composerParticipantCard = options.currentComposerUser.cardName;
      const businessNetworkHandler  = new BusinessNetworkHandler();
      const transactionHandler      = new TransactionHandler(businessNetworkHandler);

      await transactionHandler.invoke(
        composerParticipantCard,
        TransactionType.requestPurchase,
        data
      );
    } catch (error) {
      console.log(error);

      return Promise.reject(error);
    }
  }

  public async respondToPurchaseRequest(options: any, data: any): Promise<void> {
    try {
      const composerParticipantCard = options.currentComposerUser.cardName;
      const businessNetworkHandler  = new BusinessNetworkHandler();
      const transactionHandler      = new TransactionHandler(businessNetworkHandler);

      await transactionHandler.invoke(
        composerParticipantCard,
        TransactionType.respondToPurchaseRequest,
        data
      );
    } catch (error) {
      console.log(error);

      return Promise.reject(error);
    }
  }

  public async processStockSale(options: any, data: any): Promise<void> {
    try {
      const composerParticipantCard = options.currentComposerUser.cardName;
      const businessNetworkHandler  = new BusinessNetworkHandler();
      const transactionHandler      = new TransactionHandler(businessNetworkHandler);

      await transactionHandler.invoke(
        composerParticipantCard,
        TransactionType.processStockSale,
        data
      );
    } catch (error) {
      console.log(error);

      return Promise.reject(error);
    }
  }
}

module.exports = Stock;
