import {Model} from '@mean-expert/model';
import {BusinessNetworkHandler} from '../../domain/composer/composerConnections/BusinessNetworkHandler';
import {TransactionHandler} from '../../domain/composer/transactionHandler/TransactionHandler';
import {TransactionType} from '../../domain/composer/types/TransactionType';
import {Container} from 'typedi';
import {TokenUtility} from '../../domain/utils/user/TokenUtility';
import {QueryType} from '../../domain/composer/types/QueryType';
import {LoggerInstance} from 'winston';
import {LoggerFactory} from '../../domain/utils/logger/LoggerFactory';

@Model()
class Batch {
  private logger: LoggerInstance;

  public constructor(public model: any) {
    this.logger = Container.get(LoggerFactory).get('SampleAsset');

    this.model.getAllSampleAssets = this.getAllSampleAssets;

    this.model.getSampleAssetById = this.getSampleAssetById;

    this.model.newSampleAsset = this.newSampleAsset;

    this.model.updateSampleAsset = this.updateSampleAsset;

    this.model.once('attached', () => {
      this.model.observe('before save', this.submitCreateSampleAssetTransactionOnComposer);
    });
  }

  public async getAllSampleAssets(options: any): Promise<any> {
    try {
      const composerParticipantCard = options.currentComposerUser.cardName;
      const businessNetworkHandler  = new BusinessNetworkHandler();
      const transactionHandler      = new TransactionHandler(businessNetworkHandler);

      return await transactionHandler.query(composerParticipantCard, QueryType.getAllSampleAssets);
    } catch (error) {
      this.logger.error(error);

      return Promise.reject(error);
    }
  }

  public async getSampleAssetById(options: any, sampleAssetId: string): Promise<any> {
    try {
      const composerParticipantCard = options.currentComposerUser.cardName;
      const businessNetworkHandler  = new BusinessNetworkHandler();
      const transactionHandler      = new TransactionHandler(businessNetworkHandler);

      return await transactionHandler.query(composerParticipantCard, QueryType.getSampleAssetById, {
        sampleAssetId: sampleAssetId
      });
    } catch (error) {
      this.logger.error(error);

      return Promise.reject(error);
    }
  }

  public async newSampleAsset(options: any, sampleAsset: any): Promise<void> {
    try {
      const businessNetworkHandler  = new BusinessNetworkHandler();
      const composerParticipantCard = options.currentComposerUser.cardName;
      const transactionHandler      = new TransactionHandler(businessNetworkHandler);

      await transactionHandler.invoke(
        composerParticipantCard,
        TransactionType.createSampleAsset,
        sampleAsset
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async updateSampleAsset(options: any, sampleAsset: any): Promise<void> {
    try {
      const composerParticipantCard = options.currentComposerUser.cardName;
      const businessNetworkHandler  = new BusinessNetworkHandler();
      const transactionHandler      = new TransactionHandler(businessNetworkHandler);

      await transactionHandler.invoke(
        composerParticipantCard,
        TransactionType.updateSampleAsset,
        sampleAsset
      );
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(error);
    }
  }

  private async submitCreateSampleAssetTransactionOnComposer(ctx: any, options: any, next: any): Promise<void> {
    try {
      const businessNetworkHandler  = new BusinessNetworkHandler();
      const composerParticipantCard = options.currentComposerUser.cardName;
      const transactionHandler      = new TransactionHandler(businessNetworkHandler);

      await transactionHandler.invoke(
        composerParticipantCard,
        TransactionType.createSampleAsset,
        ctx.instance
      );
    } catch (error) {
      return Promise.reject(error);
    }

    next();
  }
}

module.exports = Batch;
