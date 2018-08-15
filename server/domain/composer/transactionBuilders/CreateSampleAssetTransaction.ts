import {CreateAssetTransactionBuilder} from './CreateAssetTransactionBuilder';
import {AssetType} from '../types/AssetType';
import {TransactionType} from "../types/TransactionType";
import {ComposerConceptType} from "../types/ComposerConceptType";

export class CreateSampleAssetTransaction extends CreateAssetTransactionBuilder {

  public constructor() {
    super();
    this.transactionType = TransactionType.createSampleAsset
    this.assetType = AssetType.sampleAsset
  }

  protected async buildAssetObject(assetObject: any, data: any): Promise<any> {
    assetObject.assetId    = data.assetId;
    assetObject.status     = data.status;
    assetObject.value      = data.value;
    assetObject.supplier   = data.supplier;

    const factory          = await this.getFactory();
    assetObject.owner      = this.newRelationship(AssetType.sampleOrg, data.owner.entityID);
    let creation           = await factory.newConcept(this.composerNameSpace, ComposerConceptType.Creation);
    creation.date          = data.creation.date;
    assetObject.creation   = creation;

    return assetObject;
  }
}
