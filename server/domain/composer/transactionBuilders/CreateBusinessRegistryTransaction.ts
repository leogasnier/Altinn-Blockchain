import {TransactionType} from '../types/TransactionType';
import {ParticipantType} from '../types/ParticipantType';
import {CreateParticipantTransactionBuilder} from './CreateParticipantTransactionBuilder';

export class CreateBusinessRegistryTransaction extends CreateParticipantTransactionBuilder {
  public constructor() {
    super();
    this.transactionType = TransactionType.createBusinessRegistry;
    this.participantType = ParticipantType.businessRegistry;
  }

  protected buildParticipantObject(participantObject: any, data: any): any {
    participantObject.firstName                      = data.firstName;
    participantObject.lastName                       = data.lastName;
    participantObject.receivedChangeOnCompanyRequest = [];

    return participantObject;
  }
}
