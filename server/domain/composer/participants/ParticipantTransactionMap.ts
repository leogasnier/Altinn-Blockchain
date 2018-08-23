import {TransactionType} from '../types/TransactionType';
import {ParticipantType} from '../types/ParticipantType';

export class ParticipantTransactionMap {
  public static getCreateTransaction(participantType: ParticipantType): TransactionType {
    if (participantType === ParticipantType.sampleParticipant) {
      return TransactionType.createSampleParticipant;
    } else if (participantType === ParticipantType.businessRegistry) {
      return TransactionType.createBusinessRegistry;
    } else if (participantType === ParticipantType.chairmanOfTheBoard) {
      return TransactionType.createChairmanOfTheBoard;
    } else if (participantType === ParticipantType.company) {
      return TransactionType.createCompany;
    } else if (participantType === ParticipantType.stockOwner) {
      return TransactionType.createStockOwner;
    } else {
      throw new Error(participantType + ' participant type not found');
    }
  }
}
