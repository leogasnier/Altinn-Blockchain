import {TransactionType} from '../types/TransactionType';
import {TransactionBuilder} from './TransactionBuilder';
import {ParticipantHandler} from '../participants/ParticipantHandler';
import {Factory} from 'composer-common';

export class CreateRegistryOfShareHoldersTransaction extends TransactionBuilder {
  protected transactionType: TransactionType;
  protected participantHandler: ParticipantHandler;

  public constructor() {
    super();
    this.participantHandler = new ParticipantHandler();
    this.transactionType    = TransactionType.createRegistryOfShareHolders;
  }

  public async create(data: any): Promise<any> {
    const factory: Factory = await this.getFactory();
    let transaction        = await factory.newTransaction(this.composerNameSpace, this.transactionType);

    transaction.companyID            = data.companyID;
    transaction.companyName          = data.companyName;
    transaction.chairmanOfTheBoardID = data.chairmanOfTheBoardID;
    transaction.capital              = data.capital;
    transaction.numberOfStocks       = data.numberOfStocks;

    return transaction;
  }
}
