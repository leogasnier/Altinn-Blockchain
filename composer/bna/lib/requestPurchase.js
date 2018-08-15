/**
 * Transaction for making purchase request
 * @param {org.altinn.RequestPurchase} requestPurchase - request purchase
 * @transaction
 */
async function requestPurchase(tx) {
  const namespace = CONFIG.composerNamespace;
  const factory = getFactory();

  try {
    let stockOwnerRegistry = await getParticipantRegistry(namespace + '.' + 'StockOwner');
    let customer = await stockOwnerRegistry.get(tx.customer);
    let stockOwner = await stockOwnerRegistry.get(tx.stockOwner);

    let request = factory.newConcept(namespace, 'ResponseRequest');
    request.IdToTransactionWithEvent = tx.transactionId;
    request.response = 'PENDING';
    customer.pendingRequests.push(request);
    stockOwner.receivedPurchaseRequests.push(request);

    await stockOwnerRegistry.updateAll([stockOwner, customer]);

    let event = factory.newEvent(namespace, 'StockPurchaseRequest');
    event.bid = tx.bid;
    event.quantity = tx.quantity;
    event.customer = tx.customer;
    event.stockOwner = tx.stockOwner;
    event.registerOfShareholders = tx.registerOfShareholders;

    return emit(event);
  } catch (error) {
    throw new Error('[RequestPurchase] failed' + error);
  }
}
