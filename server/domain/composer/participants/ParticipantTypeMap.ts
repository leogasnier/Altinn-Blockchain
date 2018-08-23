import {ParticipantType} from '../types/ParticipantType';

export class ParticipantTypeMap {
  public static getParticipantTypeByParticipantClass(participantClass: string): ParticipantType {
    if (participantClass === 'SampleParticipant') {
      return ParticipantType.sampleParticipant;
    } else if (participantClass === 'BusinessRegistry') {
      return ParticipantType.businessRegistry;
    } else if (participantClass === 'ChairmanOfTheBoard') {
      return ParticipantType.chairmanOfTheBoard;
    } else if (participantClass === 'Company') {
      return ParticipantType.company;
    } else if (participantClass === 'StockOwner') {
      return ParticipantType.stockOwner;
    } else if (participantClass === 'BusinessRegistry') {
      return ParticipantType.businessRegistry;
    } else {
      throw new Error(participantClass + ' participant class not found');
    }
  }
}
