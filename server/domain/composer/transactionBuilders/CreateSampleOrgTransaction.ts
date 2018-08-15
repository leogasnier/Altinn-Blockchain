import {TransactionType} from '../types/TransactionType';
import {CreateAssetTransactionBuilder} from "./CreateAssetTransactionBuilder";
import {AssetType} from "../types/AssetType";

export class CreateSampleOrgTransaction extends CreateAssetTransactionBuilder {
  public constructor() {
    super();
    this.transactionType = TransactionType.createSampleOrg;
    this.assetType = AssetType.sampleOrg;
  }

  protected buildAssetObject(assetObject: any, data: any): any {
    assetObject.entityID = data.entityID;
    assetObject.name     = data.name;

    return assetObject;
  }
}
