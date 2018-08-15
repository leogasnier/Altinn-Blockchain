/**
 * Transaction for creating a Company
 * @param {org.altinn.CreateCompany} createCompany - creating a new stockBook for firm
 * @transaction
 */
async function createCompany(tx) {
  const namespace = CONFIG.composerNamespace;
  const factory = getFactory();

  try {
    if (tx.response !== 'REJECTED' && tx.response !== 'ACCEPTED')
      throw new Error('Request Response should be ACCEPTED or REJECTED');

    let businessRegistryParticipantRegistry = await getParticipantRegistry(namespace + '.' + 'BusinessRegistry');
    let companyRegistry = await getParticipantRegistry(namespace + '.' + 'Company');


    const stockPurchaseRequests = await query('getStockPurchaseRequest', {id: tx.IdToTransactionWithEvent});
    const requestData = stockPurchaseRequests[0].eventsEmitted[0];

    const BusinessRegistry = await businessRegistryParticipantRegistry.get('0327');
    const companyId = requestData.company.getIdentifier();
    const companyRelation = requestData.company;
    const company = await companyRegistry.get(companyId);


    if (tx.response === 'REJECTED') {

      const index = await BusinessRegistry.receivedEstablishCompanyRequest.findIndex(request => request.IdToTransactionWithEvent === requestData.IdToTransactionWithEvent);
      BusinessRegistry.receivedEstablishCompanyRequest.splice(index, 1);

      await businessRegistryParticipantRegistry.update(BusinessRegistry);


      const companyIndex = await company.establishCompanyRequest.findIndex(request => request.IdToTransactionWithEvent === requestData.IdToTransactionWithEvent);
      company.establishCompanyRequest[companyIndex].response = 'REJECTED';

      await companyRegistry.update(company);

      return "Establish company request was rejected.";
    }

    let stockBook = factory.newResource(namespace, 'RegisterOfShareholders', companyId);
    let assetRegistryOfRegisterOfShareHolders = await getAssetRegistry(namespace + '.' + 'RegisterOfShareholders');

    stockBook.numberOfShares = requestData.numberOfStock;
    stockBook.capital = requestData.capital;
    const denomination = requestData.capital / requestData.numberOfStock;
    stockBook.firstDenomination = denomination;
    stockBook.belongsTo = companyRelation;
    stockBook.approved = true;

    await assetRegistryOfRegisterOfShareHolders.add(stockBook);

    let stockWithHighestID = await query('selectHighestStockId');
    if (stockWithHighestID.length > 0 && stockWithHighestID != null && stockWithHighestID.length != null) {
      stockWithHighestID.sort(function (a, b) {
        var x = parseInt(a.id), y = parseInt(b.id);

        return x > y ? -1 : x < y ? 1 : 0;
      });
      newStockId = parseInt(stockWithHighestID[0].id) + 1;
    } else {
      newStockId = parseInt(1);
    }

    let stockRegistry = await getAssetRegistry(namespace + '.' + 'Stock');
    let newStocks = [];
    requestData.newStockOwners.forEach((owner, index) => {
      for (let i = 0; i < requestData.distribution[index]; i++) {
        const stockId = newStockId.toString();
        const stock = factory.newResource(namespace, 'Stock', stockId);
        stock.value = stockBook.firstDenomination;
        stock.denomination = stockBook.firstDenomination;
        stock.marketValue = stockBook.firstDenomination;
        stock.registerOfShareholders = stockBook;
        stock.type = "";
        stock.purchasedDate = requestData.timestamp;
        stock.owner = owner;
        newStocks.push(stock);
        newStockId += 1;
      }
    });

    await stockRegistry.addAll(newStocks);

    const index = await BusinessRegistry.receivedEstablishCompanyRequest.findIndex(request => request.IdToTransactionWithEvent === requestData.IdToTransactionWithEvent);
    BusinessRegistry.receivedEstablishCompanyRequest.splice(index, 1);

    await businessRegistryParticipantRegistry.update(BusinessRegistry);

    company.establishCompanyRequest.find(request => request.IdToTransactionWithEvent === requestData.IdToTransactionWithEvent).response = 'ACCEPTED';

    await companyRegistry.update(company);

    return "Establish company request was ACCEPTED.";
  } catch (error) {
    throw new Error('[CreateCompany] failed' + error);
  }
}
