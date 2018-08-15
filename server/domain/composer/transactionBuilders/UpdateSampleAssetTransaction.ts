import {TransactionType} from '../types/TransactionType';
import {TransactionBuilder} from './TransactionBuilder';
import {Factory} from 'composer-common';

export class UpdateSampleAssetTransaction extends TransactionBuilder {
  private transactionType: TransactionType;

  public constructor() {
    super();
    this.transactionType = TransactionType.updateSampleAsset;
  }

  public async create(data: any): Promise<any> {
    const factory: Factory  = await this.getFactory();
    let transaction         = await factory.newTransaction(this.composerNameSpace, this.transactionType);
    transaction.sampleAsset = data;

    return transaction;
  }
}