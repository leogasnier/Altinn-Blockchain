import {TransactionType} from '../types/TransactionType';
import {TransactionBuilder} from './TransactionBuilder';
import {ParticipantHandler} from '../participants/ParticipantHandler';
import {Factory} from 'composer-common';

export class RequestPurchaseTransaction extends TransactionBuilder {
  protected transactionType: TransactionType;
  protected participantHandler: ParticipantHandler;

  public constructor() {
    super();
    this.participantHandler = new ParticipantHandler();
    this.transactionType    = TransactionType.requestPurchase;
  }

  public async create(data: any): Promise<any> {
    const factory: Factory = await this.getFactory();
    let transaction        = await factory.newTransaction(this.composerNameSpace, this.transactionType);

    transaction.bid                    = data.bid;
    transaction.quantity               = data.quantity;
    transaction.customer               = data.customer;
    transaction.stockOwner             = data.stockOwner;
    transaction.registryOfShareHolders = data.registryOfShareHolders;

    return transaction;
  }
}
