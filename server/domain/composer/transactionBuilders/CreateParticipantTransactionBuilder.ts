import {TransactionType} from '../types/TransactionType';
import {TransactionBuilder} from './TransactionBuilder';
import {ParticipantType} from '../types/ParticipantType';
import {Factory} from 'composer-common';

export abstract class CreateParticipantTransactionBuilder extends TransactionBuilder {
  protected transactionType: TransactionType;
  protected participantType: ParticipantType;

  public constructor() {
    super();
  }

  public async create(data: any): Promise<any> {
    const factory: Factory   = await this.getFactory();
    let transaction          = await factory.newTransaction(this.composerNameSpace, this.transactionType);
    let participantFieldName = this.participantType.substring(0, 1).toLowerCase() + this.participantType.substring(1);
    
    transaction[participantFieldName] = await factory.newResource(this.composerNameSpace, this.participantType, data.ID);
    transaction[participantFieldName] = this.buildParticipantObject(transaction[participantFieldName], data);

    return transaction;
  }

  protected abstract async buildParticipantObject(transaction: any, data: any): Promise<any>;
}
