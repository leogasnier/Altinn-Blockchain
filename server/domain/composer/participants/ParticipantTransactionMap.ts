import {TransactionType} from '../types/TransactionType';
import {ParticipantType} from '../types/ParticipantType';

export class ParticipantTransactionMap {
  public static getCreateTransaction(participantType: ParticipantType): TransactionType {
    if (participantType === ParticipantType.sampleParticipant) {
      return TransactionType.createSampleParticipant;
    }

    throw new Error(participantType + ' participant type not found');
  }
}
