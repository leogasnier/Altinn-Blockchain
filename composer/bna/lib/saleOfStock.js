/**
 * Transaction of buy/sales between oweners of a Stock
 * @param {org.altinn.SaleOfStock} saleOfStock - the Stock to be processed
 * @transaction
 */
async function saleOfStock(tx) {
  const namespace = CONFIG.composerNamespace;

  try {
    if (tx.response !== 'REJECTED' && tx.response !== 'ACCEPTED')
      throw new Error('Request Response should be ACCEPTED or REJECTED');

    const stockPurchaseRequests = await query('getStockPurchaseRequest', {id: tx.transID});
    const requestData = stockPurchaseRequests[0].eventsEmitted[0];

    let stockOwnerRegistry = await getParticipantRegistry(namespace + '.' + 'StockOwner');
    let customer = await stockOwnerRegistry.get(requestData.customer);
    let stockOwner = await stockOwnerRegistry.get(requestData.stockOwner);
    let companyRegistry = await getParticipantRegistry(namespace + '.' + 'Company');
    const company = await companyRegistry.get(requestData.registerOfShareholders);

    const companyIndex = await company.awaitingStockPurchase.findIndex(req => req.IdToTransactionWithEvent === tx.transID);
    const customerIndex = await customer.pendingRequests.findIndex(req => req.IdToTransactionWithEvent === tx.transID);
    const stockOwnerIndex = await stockOwner.receivedPurchaseRequests.findIndex(req => req.IdToTransactionWithEvent === tx.transID);
    if (tx.response === 'REJECTED') {
      company.awaitingStockPurchase.splice(companyIndex, 1);
      await companyRegistry.update(company);
      customer.pendingRequests[customerIndex].response = 'REJECTED';
      stockOwner.receivedPurchaseRequests[stockOwnerIndex].response = 'REJECTED';
      await stockOwnerRegistry.updateAll([customer, stockOwner]);

      return "Sale was rejected by company.";
    }

    const companyResource = 'resource:org.altinn.RegisterOfShareholders#' + requestData.registerOfShareholders;
    const stockOwnerResource = 'resource:org.altinn.StockOwner#' + requestData.stockOwner;

    let firstStocks = await query('getFirstStocks', {company: companyResource, ownerIn: stockOwnerResource});
    if (firstStocks.length < requestData.quantity)
      throw new Error('Du vil ha ' + requestData.quantity + ' aksjer. Personen du prøver å kjøpe av har kun: ' + firstStocks.length);

    const stockRegistry = await getAssetRegistry(namespace + '.' + 'Stock');
    for (let n = 0; n < requestData.quantity; n++) {
      firstStocks[n].marketValue = requestData.bid;
      firstStocks[n].owner = customer;
      firstStocks[n].purchasedDate = requestData.timestamp;
    }
    await stockRegistry.updateAll(firstStocks);

    company.awaitingStockPurchase.splice(companyIndex, 1);

    await companyRegistry.update(company);

    customer.pendingRequests[customerIndex].response = 'ACCEPTED';
    stockOwner.receivedPurchaseRequests[stockOwnerIndex].response = 'ACCEPTED';

    await stockOwnerRegistry.updateAll([customer, stockOwner]);

    return "Sale was accepted by company.";
  } catch (error) {
    throw new Error('[SaleOfStock] failed' + error);
  }
}
