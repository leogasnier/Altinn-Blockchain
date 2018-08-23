import {TransactionType} from '../types/TransactionType';
import {ParticipantType} from '../types/ParticipantType';
import {CreateParticipantTransactionBuilder} from './CreateParticipantTransactionBuilder';

export class CreateStockOwnerTransaction extends CreateParticipantTransactionBuilder {
  public constructor() {
    super();
    this.transactionType = TransactionType.createStockOwner;
    this.participantType = ParticipantType.stockOwner;
  }

  protected buildParticipantObject(participantObject: any, data: any): any {
    participantObject.firstName                              = data.firstName;
    participantObject.lastName                               = data.lastName;
    participantObject.socialSecurityNumber                   = data.socialSecurityNumber;
    participantObject.pendingRequests                        = [];
    participantObject.receivedPurchaseRequests               = [];

    return participantObject;
  }
}
