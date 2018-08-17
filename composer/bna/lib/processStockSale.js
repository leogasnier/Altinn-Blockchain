/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit */

/**
 * Transaction of buy/sales between oweners of a Stock
 * @param {org.altinn.ProcessStockSale} processStockSale - the Stock to be processed
 * @transaction
 */
async function processStockSale(tx) {
  const namespace = CONFIG.composerNamespace;
  const factory = getFactory();

  try {
    if (tx.response !== 'REJECTED' && tx.response !== 'ACCEPTED')
      throw new Error('Request Response should be ACCEPTED or REJECTED');

    const stockPurchaseRequests = await query('getStockPurchaseRequest', {id: tx.transactionID});
    const requestData = stockPurchaseRequests[0].eventsEmitted[0];

    let stockOwnerRegistry = await getParticipantRegistry(namespace + '.' + 'StockOwner');
    let customer = await stockOwnerRegistry.get(requestData.customer);
    let stockOwner = await stockOwnerRegistry.get(requestData.stockOwner);
    let companyRegistry = await getParticipantRegistry(namespace + '.' + 'Company');
    const company = await companyRegistry.get(requestData.registryOfShareHolders);

    const companyIndex = await company.awaitingStockPurchase.findIndex(req => req.transactionID === tx.transactionID);
    const customerIndex = await customer.pendingRequests.findIndex(req => req.transactionID === tx.transactionID);
    const stockOwnerIndex = await stockOwner.receivedPurchaseRequests.findIndex(req => req.transactionID === tx.transactionID);
    if (tx.response === 'REJECTED') {
      company.awaitingStockPurchase.splice(companyIndex, 1);
      await companyRegistry.update(company);
      customer.pendingRequests[customerIndex].response = 'REJECTED';
      stockOwner.receivedPurchaseRequests[stockOwnerIndex].response = 'REJECTED';
      await stockOwnerRegistry.updateAll([customer, stockOwner]);

      return "Sale was rejected by company.";
    }

    const companyResource = 'resource:org.altinn.RegistryOfShareHolders#' + requestData.registryOfShareHolders;
    const stockOwnerResource = 'resource:org.altinn.StockOwner#' + requestData.stockOwner;

    let firstStocks = await query('getFirstStocks', {company: companyResource, ownerID: stockOwnerResource});
    if (firstStocks.length < requestData.quantity)
      throw new Error('Du vil ha ' + requestData.quantity + ' aksjer. Personen du prøver å kjøpe av har kun: ' + firstStocks.length);

    const stockRegistry = await getAssetRegistry(namespace + '.' + 'Stock');
    for (let n = 0; n < requestData.quantity; n++) {
      firstStocks[n].marketValue = requestData.bid;
      firstStocks[n].owner = customer;
      firstStocks[n].purchasedDate = requestData.timestamp;
      firstStocks[n].owner = factory.newRelationship(namespace, 'StockOwner', requestData.customer);
    }
    await stockRegistry.updateAll(firstStocks);

    company.awaitingStockPurchase.splice(companyIndex, 1);

    await companyRegistry.update(company);

    customer.pendingRequests[customerIndex].response = 'ACCEPTED';
    stockOwner.receivedPurchaseRequests[stockOwnerIndex].response = 'ACCEPTED';

    await stockOwnerRegistry.updateAll([customer, stockOwner]);

    return "Sale was accepted by company.";
  } catch (error) {
    throw new Error('[ProcessStockSale] failed' + error);
  }
}
