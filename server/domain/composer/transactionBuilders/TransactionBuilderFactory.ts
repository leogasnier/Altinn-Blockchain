import {TransactionType} from '../types/TransactionType';
import {TransactionBuilder} from './TransactionBuilder';
import {CreateSampleParticipantTransaction} from './CreateSampleParticipantTransaction';
import {CreateSampleAssetTransaction} from './CreateSampleAssetTransaction';
import {CreateSampleOrgTransaction} from './CreateSampleOrgTransaction';
import {UpdateSampleAssetTransaction} from './UpdateSampleAssetTransaction';

export class TransactionBuilderFactory {
  public static getTransactionBuilder(transactionType: TransactionType): TransactionBuilder {
    if (transactionType === TransactionType.createSampleOrg) {
      return new CreateSampleOrgTransaction();
    } else if (transactionType === TransactionType.createSampleParticipant) {
      return new CreateSampleParticipantTransaction();
    } else if (transactionType === TransactionType.createSampleAsset) {
      return new CreateSampleAssetTransaction();
    } else if (transactionType === TransactionType.updateSampleAsset) {
      return new UpdateSampleAssetTransaction();
    } else {
      throw new Error(transactionType + ' transaction type not found');
    }
  }
}
