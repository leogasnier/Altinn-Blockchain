import {TransactionType} from '../types/TransactionType';
import {TransactionBuilder} from './TransactionBuilder';
import {ParticipantType} from '../types/ParticipantType';
import {ParticipantHandler} from '../participants/ParticipantHandler';
import {Factory} from 'composer-common';

export class CreateCompanyTransaction extends TransactionBuilder {
  protected transactionType: TransactionType;
  protected participantHandler: ParticipantHandler;
  protected participantType: ParticipantType;

  public constructor() {
    super();
    this.participantHandler = new ParticipantHandler();
    this.transactionType    = TransactionType.createCompany;
    this.participantType    = ParticipantType.company;
  }

  public async create(data: any): Promise<any> {
    const factory: Factory = await this.getFactory();
    let transaction        = await factory.newTransaction(this.composerNameSpace, this.transactionType);

    transaction.companyId          = data.companyID;
    transaction.companyName        = data.companyName;
    transaction.chairmanOfTheBoard = data.chairmanOfTheBoard;

    return transaction;
  }
}
