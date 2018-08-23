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
 * Transaction for making purchase request for stocks
 * @param {org.altinn.RequestPurchase} requestPurchase - request stocks purchase
 * @transaction
 */
async function requestPurchase(tx) {
  const namespace = CONFIG.composerNamespace;
  const currentParticipant = getCurrentParticipant();
  const factory = getFactory();

  try {
    if (currentParticipant.getIdentifier() !== tx.customer)
      throw new Error('Purchase requests are available only if you are the customer!');

    const companyResource = 'resource:org.altinn.RegistryOfShareHolders#' + tx.registryOfShareHolders;
    const stockOwnerResource = 'resource:org.altinn.StockOwner#' + tx.stockOwner;

    let firstStocks = await query('getFirstStocks', {company: companyResource, ownerID: stockOwnerResource});
    if (firstStocks.length < tx.quantity)
      throw new Error('You have requested ' + tx.quantity + ' stocks. The stock owner you made the purchase request has only: ' + firstStocks.length);

    let stockOwnerRegistry = await getParticipantRegistry(namespace + '.' + 'StockOwner');
    let customer = await stockOwnerRegistry.get(tx.customer);
    let stockOwner = await stockOwnerRegistry.get(tx.stockOwner);

    let request = factory.newConcept(namespace, 'ResponseRequest');
    request.transactionID = tx.transactionId;
    request.response = 'PENDING';
    customer.pendingRequests.push(request);
    stockOwner.receivedPurchaseRequests.push(request);

    await stockOwnerRegistry.updateAll([stockOwner, customer]);

    let event = factory.newEvent(namespace, 'StockPurchaseRequest');
    event.bid = tx.bid;
    event.quantity = tx.quantity;
    event.customer = tx.customer;
    event.stockOwner = tx.stockOwner;
    event.registryOfShareHolders = tx.registryOfShareHolders;

    return emit(event);
  } catch (error) {
    throw new Error('[RequestPurchase] failed' + error);
  }
}
