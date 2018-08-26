/* tslint:disable */

declare var Object: any;
export interface RegistryOfShareHoldersInterface {
  "id"?: string;
  "_rev"?: string;
}

export class RegistryOfShareHolders implements RegistryOfShareHoldersInterface {
  "id": string;
  "_rev": string;
  constructor(data?: RegistryOfShareHoldersInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RegistryOfShareHolders`.
   */
  public static getModelName() {
    return "RegistryOfShareHolders";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RegistryOfShareHolders for dynamic purposes.
  **/
  public static factory(data: RegistryOfShareHoldersInterface): RegistryOfShareHolders{
    return new RegistryOfShareHolders(data);
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
      name: 'RegistryOfShareHolders',
      plural: 'RegistriesOfShareHolders',
      path: '/registryOfShareHolders',
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
