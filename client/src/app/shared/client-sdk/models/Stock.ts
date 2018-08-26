/* tslint:disable */

declare var Object: any;
export interface StockInterface {
  "id"?: string;
  "_rev"?: string;
}

export class Stock implements StockInterface {
  "id": string;
  "_rev": string;
  constructor(data?: StockInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Stock`.
   */
  public static getModelName() {
    return "Stock";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Stock for dynamic purposes.
  **/
  public static factory(data: StockInterface): Stock{
    return new Stock(data);
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
      name: 'Stock',
      plural: 'Stocks',
      path: '/stocks',
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
