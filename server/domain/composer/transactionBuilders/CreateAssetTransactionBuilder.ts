import {TransactionType} from '../types/TransactionType';
import {TransactionBuilder} from './TransactionBuilder';
import {AssetType} from '../types/AssetType';
import {ParticipantHandler} from '../participants/ParticipantHandler';

export abstract class CreateAssetTransactionBuilder extends TransactionBuilder {
  protected transactionType: TransactionType;
  protected assetType: AssetType;
  protected participantHandler: ParticipantHandler;

  public constructor() {
    super();
    this.participantHandler = new ParticipantHandler();
  }

  public async create(data: any): Promise<any> {
    const factory      = await this.getFactory();
    let transaction    = await factory.newTransaction(this.composerNameSpace, this.transactionType);
    let assetFieldName = this.assetType.substring(0, 1).toLowerCase() + this.assetType.substring(1);


    transaction[assetFieldName] = await factory.newResource(this.composerNameSpace, this.assetType, data.assetId);
    transaction[assetFieldName] = await this.buildAssetObject(transaction[assetFieldName], data);

    return transaction;
  }

  protected abstract async buildAssetObject(assetObject: any, data: any): Promise<any>;
}
