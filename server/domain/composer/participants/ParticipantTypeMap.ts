import {ParticipantType} from '../types/ParticipantType';

export class ParticipantTypeMap {
  public static getParticipantTypeByParticipantClass(participantClass: string): ParticipantType {
    if (participantClass === 'SampleParticipant') {
      return ParticipantType.sampleParticipant;
    }

    throw new Error(participantClass + ' participant class not found');
  }
}
