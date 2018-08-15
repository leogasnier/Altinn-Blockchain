/* tslint:disable */

declare var Object: any;
export interface AssetInterface {
  "assetID": string;
  "_rev"?: string;
}

export class Asset implements AssetInterface {
  "assetID": string;
  "_rev": string;
  constructor(data?: AssetInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Asset`.
   */
  public static getModelName() {
    return "Asset";
  }
  /**
   * @method factory
   * @author Jonathan Casarrubias
   * @license MIT
   * This method creates an instance of Asset for dynamic purposes.
   **/
  public static factory(data: AssetInterface): Asset {
    return new Asset(data);
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
      name:       'Asset',
      plural:     'Assets',
      path:       'Assets',
      idName:     'id',
      properties: {
        "assetID": {
          name: 'assetID',
          type: 'string'
        },
        "_rev":    {
          name: '_rev',
          type: 'string'
        },
      },
      relations:  {}
    }
  }
}
