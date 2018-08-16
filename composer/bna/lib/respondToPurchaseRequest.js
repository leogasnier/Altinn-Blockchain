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
 * Transaction for responding on a purchase request
 * @param {org.altinn.RespondToPurchaseRequest} respondToPurchaseRequest - respond to a purchase request
 * @transaction
 */
async function respondToPurchaseRequest(tx) {
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

    if (tx.response === 'REJECTED') {
      const stockOwnerIndex = await stockOwner.receivedPurchaseRequests.findIndex(req => req.transactionID === tx.transactionID);
      stockOwner.receivedPurchaseRequests.splice(stockOwnerIndex, 1);

      const customerIndex = await customer.pendingRequests.findIndex(req => req.transactionID === tx.transactionID);
      customer.pendingRequests[customerIndex].response = 'REJECTED';

      return stockOwnerRegistry.updateAll([stockOwner, customer]);
    }

    const companyRegistry = await getParticipantRegistry(namespace + '.' + 'Company');
    const company = await companyRegistry.get(requestData.registerOfShareholders);
    const request = factory.newConcept(namespace, 'ResponseRequest');
    request.transactionID = tx.transactionID;
    request.response = 'PENDING';
    company.awaitingStockPurchase.push(request);

    return companyRegistry.update(company);

  } catch (error) {
    throw new Error('[RespondToPurchaseRequest] failed' + error);
  }
}
