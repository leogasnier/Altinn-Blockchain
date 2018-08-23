import {TransactionType} from '../types/TransactionType';
import {TransactionBuilder} from './TransactionBuilder';
import {CreateSampleParticipantTransaction} from './CreateSampleParticipantTransaction';
import {CreateBusinessRegistryTransaction} from './CreateBusinessRegistryTransaction';
import {CreateChairmanOfTheBoardTransaction} from './CreateChairmanOfTheBoardTransaction';
import {CreateCompanyTransaction} from './CreateCompanyTransaction';
import {CreateStockOwnerTransaction} from './CreateStockOwnerTransaction';
import {CreateRegistryOfShareHoldersTransaction} from './CreateRegistryOfShareHoldersTransaction';
import {DistributeStocksToStockOwnersTransaction} from './DistributeStocksToStockOwnersTransaction';
import {ExpandCapitalRequestTransaction} from './ExpandCapitalRequestTransaction';
import {ExpandCapitalTransaction} from './ExpandCapitalTransaction';
import {RequestPurchaseTransaction} from './RequestPurchaseTransaction';
import {RespondToPurchaseRequestTransaction} from './RespondToPurchaseRequestTransaction';
import {ProcessStockSaleTransaction} from './ProcessStockSaleTransaction';

export class TransactionBuilderFactory {
  public static getTransactionBuilder(transactionType: TransactionType): TransactionBuilder {
    if (transactionType === TransactionType.createBusinessRegistry) {
      return new CreateBusinessRegistryTransaction();
    } else if (transactionType === TransactionType.createChairmanOfTheBoard) {
      return new CreateChairmanOfTheBoardTransaction();
    } else if (transactionType === TransactionType.createCompany) {
      return new CreateCompanyTransaction();
    } else if (transactionType === TransactionType.createStockOwner) {
      return new CreateStockOwnerTransaction();
    } else if (transactionType === TransactionType.createSampleParticipant) {
      return new CreateSampleParticipantTransaction();
    } else if (transactionType === TransactionType.createRegistryOfShareHolders) {
      return new CreateRegistryOfShareHoldersTransaction();
    } else if (transactionType === TransactionType.distributeStocksToStockOwners) {
      return new DistributeStocksToStockOwnersTransaction();
    } else if (transactionType === TransactionType.expandCapitalRequest) {
      return new ExpandCapitalRequestTransaction();
    } else if (transactionType === TransactionType.expandCapital) {
      return new ExpandCapitalTransaction();
    } else if (transactionType === TransactionType.requestPurchase) {
      return new RequestPurchaseTransaction();
    } else if (transactionType === TransactionType.respondToPurchaseRequest) {
      return new RespondToPurchaseRequestTransaction();
    } else if (transactionType === TransactionType.processStockSale) {
      return new ProcessStockSaleTransaction();
    } else {
      throw new Error(transactionType + ' transaction type not found');
    }
  }
}
