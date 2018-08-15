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

    const stockPurchaseRequests = await query('getStockPurchaseRequest', {id: tx.transID});
    const requestData = stockPurchaseRequests[0].eventsEmitted[0];

    let stockOwnerRegistry = await getParticipantRegistry(namespace + '.' + 'StockOwner');
    let customer = await stockOwnerRegistry.get(requestData.customer);
    let stockOwner = await stockOwnerRegistry.get(requestData.stockOwner);

    if (tx.response === 'REJECTED') {
      const stockOwnerIndex = await stockOwner.receivedPurchaseRequests.findIndex(req => req.IdToTransactionWithEvent === tx.transID);
      stockOwner.receivedPurchaseRequests.splice(stockOwnerIndex, 1);

      const customerIndex = await customer.pendingRequests.findIndex(req => req.IdToTransactionWithEvent === tx.transID);
      customer.pendingRequests[customerIndex].response = 'REJECTED';

      return stockOwnerRegistry.updateAll([stockOwner, customer]);
    }

    const companyRegistry = await getParticipantRegistry(namespace + '.' + 'Company');
    const company = await companyRegistry.get(requestData.registerOfShareholders);
    const request = factory.newConcept(namespace, 'ResponseRequest');
    request.IdToTransactionWithEvent = tx.transID;
    request.response = 'PENDING';
    company.awaitingStockPurchase.push(request);

    return companyRegistry.update(company);

  } catch (error) {
    throw new Error('[RespondToPurchaseRequest] failed' + error);
  }
}
