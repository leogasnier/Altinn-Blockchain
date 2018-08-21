import {TransactionType} from '../types/TransactionType';
import {ParticipantType} from '../types/ParticipantType';
import {CreateParticipantTransactionBuilder} from './CreateParticipantTransactionBuilder';

export class CreateCompanyTransaction extends CreateParticipantTransactionBuilder {
  public constructor() {
    super();
    this.transactionType = TransactionType.createCompany;
    this.participantType = ParticipantType.company;
  }

  protected buildParticipantObject(participantObject: any, data: any): any {
    participantObject.firstName                       = data.firstName;
    participantObject.lastName                        = data.lastName;

    return participantObject;
  }
}
