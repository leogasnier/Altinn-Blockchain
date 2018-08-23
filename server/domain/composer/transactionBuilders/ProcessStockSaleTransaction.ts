import {TransactionType} from '../types/TransactionType';
import {TransactionBuilder} from './TransactionBuilder';
import {ParticipantHandler} from '../participants/ParticipantHandler';
import {Factory} from 'composer-common';

export class ProcessStockSaleTransaction extends TransactionBuilder {
  protected transactionType: TransactionType;
  protected participantHandler: ParticipantHandler;

  public constructor() {
    super();
    this.participantHandler = new ParticipantHandler();
    this.transactionType    = TransactionType.processStockSale;
  }

  public async create(data: any): Promise<any> {
    const factory: Factory = await this.getFactory();
    let transaction        = await factory.newTransaction(this.composerNameSpace, this.transactionType);

    transaction.transactionID = data.transactionID;
    transaction.response      = data.response;

    return transaction;
  }
}
