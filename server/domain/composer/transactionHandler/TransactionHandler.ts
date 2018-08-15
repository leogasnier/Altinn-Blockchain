import {BusinessNetworkHandler} from '../composerConnections/BusinessNetworkHandler';
import {TransactionBuilder} from '../transactionBuilders/TransactionBuilder';
import {TransactionType} from '../types/TransactionType';
import {TransactionBuilderFactory} from '../transactionBuilders/TransactionBuilderFactory';
import {LoggerInstance} from 'winston';
import {LoggerFactory} from '../../utils/logger/LoggerFactory';
import {AssetRegistry} from 'composer-client';

export class TransactionHandler {
  private logger: LoggerInstance = new LoggerFactory().get('Transaction Handler');

  public constructor(private businessNetworkHandler: BusinessNetworkHandler) {
  }

  public async invoke(cardName: string, transactionType: TransactionType, data: any): Promise<any> {
    try {
      await this.businessNetworkHandler.connect(cardName);
      const transaction = await this.getTransactionBuilderByTransactionType(transactionType).create(data);
      await this.businessNetworkHandler.getBusinessNetworkConnection().submitTransaction(transaction);

      return transaction;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async get(cardName: string, connectionProfile: string, assetRegistry: string, resourceID: string): Promise<any> {
    await this.businessNetworkHandler.connect(cardName);

    const resourceAssetRegistry: AssetRegistry = await this.businessNetworkHandler.getAssetRegistry(assetRegistry);
    const rawResource                          = await resourceAssetRegistry.get(resourceID);

    await this.businessNetworkHandler.disconnect();

    return this.businessNetworkHandler.getSerializer(rawResource);
  }

  public async query(cardName: string, queryName: string, parameters?: any): Promise<any> {
    await this.businessNetworkHandler.connect(cardName);

    const assets        = await this.businessNetworkHandler.query(queryName, parameters);
    const result: any[] = await assets.map(asset => this.businessNetworkHandler.getSerializer(asset));

    await this.businessNetworkHandler.disconnect();

    return result;
  }

  private getTransactionBuilderByTransactionType(transactionType: TransactionType): TransactionBuilder {
    return TransactionBuilderFactory.getTransactionBuilder(transactionType);
  }
}
