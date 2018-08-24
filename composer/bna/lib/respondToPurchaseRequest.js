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
 * Transaction for responding on a purchase request as stock owner
 * @param {org.altinn.RespondToPurchaseRequest} respondToPurchaseRequest - respond to a purchase request as stock owner
 * @transaction
 */
async function respondToPurchaseRequest(tx) {
  const namespace = CONFIG.composerNamespace;
  const currentParticipant = getCurrentParticipant();
  const factory = getFactory();

  try {
    if (tx.response !== 'REJECTED' && tx.response !== 'ACCEPTED')
      throw new Error('Request Response should be ACCEPTED or REJECTED');

    const stockPurchaseRequests = await query('getStockPurchaseRequest', {id: tx.transactionID});
    const requestData = stockPurchaseRequests[0].eventsEmitted[0];

    if (currentParticipant.getIdentifier() !== requestData.stockOwner)
      throw new Error('Stock owners can respond to their own received purchase requests!');

    let stockOwnerRegistry = await getParticipantRegistry(namespace + '.' + 'StockOwner');
    let customer = await stockOwnerRegistry.get(requestData.customer);
    let stockOwner = await stockOwnerRegistry.get(requestData.stockOwner);
    const stockOwnerIndex = await stockOwner.receivedPurchaseRequests.findIndex(req => req.transactionID === tx.transactionID);
    const customerIndex = await customer.pendingRequests.findIndex(req => req.transactionID === tx.transactionID);

    if (tx.response === 'REJECTED') {
      stockOwner.receivedPurchaseRequests[stockOwnerIndex].response = 'REJECTED';
      customer.pendingRequests[customerIndex].response = 'REJECTED';

      return await stockOwnerRegistry.updateAll([stockOwner, customer]);
    }
    stockOwner.receivedPurchaseRequests[stockOwnerIndex].purchaseRequestAcceptedByStockOwner = true;
    customer.pendingRequests[customerIndex].purchaseRequestAcceptedByStockOwner = true;

    await stockOwnerRegistry.updateAll([stockOwner, customer]);

    let chairmanOfTheBoardRegistry = await getParticipantRegistry(namespace + '.' + 'ChairmanOfTheBoard');
    let registryOfShareHoldersRegistry = await getAssetRegistry(namespace + '.' + 'RegistryOfShareHolders');
    let registryOfShareHolders = await registryOfShareHoldersRegistry.get(requestData.registryOfShareHolders);

    let chairmanOfTheBoard = await chairmanOfTheBoardRegistry.get(registryOfShareHolders.chairmanOfTheBoard.getIdentifier());
    const request = factory.newConcept(namespace, 'ResponseRequest');
    request.transactionID = tx.transactionID;
    request.response = 'PENDING';
    chairmanOfTheBoard.awaitingStockPurchase.push(request);

    return chairmanOfTheBoardRegistry.update(chairmanOfTheBoard);
  } catch (error) {
    throw new Error('[RespondToPurchaseRequest] failed' + error);
  }
}
