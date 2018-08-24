import {TransactionType} from '../types/TransactionType';
import {TransactionBuilder} from './TransactionBuilder';
import {ParticipantHandler} from '../participants/ParticipantHandler';
import {Factory} from 'composer-common';

export class ExpandCapitalRequestTransaction extends TransactionBuilder {
  protected transactionType: TransactionType;
  protected participantHandler: ParticipantHandler;

  public constructor() {
    super();
    this.participantHandler = new ParticipantHandler();
    this.transactionType    = TransactionType.expandCapitalRequest;
  }

  public async create(data: any): Promise<any> {
    const factory: Factory = await this.getFactory();
    let transaction        = await factory.newTransaction(this.composerNameSpace, this.transactionType);

    transaction.increasedAmountOfShareCapital = data.increasedAmountOfShareCapital;
    transaction.shareholderRegistryID         = data.shareholderRegistryID;
    transaction.capitalChange                 = data.capitalChange;
    transaction.distribution                  = data.distribution;
    transaction.purchasedValuesOfStocks       = data.purchasedValuesOfStocks;
    transaction.newStockOwners                = data.newStockOwners;

    return transaction;
  }
}
