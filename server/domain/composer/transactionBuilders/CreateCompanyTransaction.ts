import {TransactionType} from '../types/TransactionType';
import {ParticipantType} from '../types/ParticipantType';
import {CreateParticipantTransactionBuilder} from './CreateParticipantTransactionBuilder';

export class CreateChairmanOfTheBoardTransaction extends CreateParticipantTransactionBuilder {
  public constructor() {
    super();
    this.transactionType = TransactionType.createChairmanOfTheBoard;
    this.participantType = ParticipantType.businessRegistry;
  }

  protected buildParticipantObject(participantObject: any, data: any): any {
    participantObject.firstName                       = data.firstName;
    participantObject.lastName                        = data.lastName;

    return participantObject;
  }
}
