import {TransactionType} from '../types/TransactionType';
import {TransactionBuilder} from './TransactionBuilder';
import {ParticipantType} from '../types/ParticipantType';
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

    transaction.newCapital            = data.newCapital;
    transaction.shareholderRegistryID = data.shareholderRegistryID;

    return transaction;
  }
}
