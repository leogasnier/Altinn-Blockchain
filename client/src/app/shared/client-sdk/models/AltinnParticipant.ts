/* tslint:disable */

declare var Object: any;
export interface AltinnParticipantInterface {
  "id"?: string;
  "_rev"?: string;
}

export class AltinnParticipant implements AltinnParticipantInterface {
  "id": string;
  "_rev": string;
  constructor(data?: AltinnParticipantInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `AltinnParticipant`.
   */
  public static getModelName() {
    return "AltinnParticipant";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of AltinnParticipant for dynamic purposes.
  **/
  public static factory(data: AltinnParticipantInterface): AltinnParticipant{
    return new AltinnParticipant(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'AltinnParticipant',
      plural: 'AltinnParticipants',
      path: '/altinnParticipant',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "_rev": {
          name: '_rev',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
