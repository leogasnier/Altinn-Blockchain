import {TransactionType} from '../types/TransactionType';
import {ParticipantType} from '../types/ParticipantType';
import {CreateParticipantTransactionBuilder} from './CreateParticipantTransactionBuilder';

export class CreateChairmanOfTheBoardTransaction extends CreateParticipantTransactionBuilder {
  public constructor() {
    super();
    this.transactionType = TransactionType.createChairmanOfTheBoard;
    this.participantType = ParticipantType.chairmanOfTheBoard;
  }

  protected buildParticipantObject(participantObject: any, data: any): any {
    participantObject.firstName                            = data.firstName;
    participantObject.lastName                             = data.lastName;
    participantObject.changeOnCompanyRequest               = [];
    participantObject.awaitingStockPurchase                = [];

    return participantObject;
  }
}
