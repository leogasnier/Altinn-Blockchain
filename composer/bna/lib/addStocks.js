/**
 * Increasing the amountOfNewStocks of aksjer in aksjebok and distributes among shareholders.
 * @param {org.altinn.AddStocks} addStocks - registerOfShareholders creates stock.
 * @transaction
 */
async function addStocks(tx) {
  const namespace = CONFIG.composerNamespace;
  const factory = getFactory();

  try {
    const stockPurchaseRequest = await query('getStockPurchaseRequest', {id: tx.IdToTransactionWithEvent});
    const changeData = stockPurchaseRequest[0].eventsEmitted[0];

    if (changeData.capitalChange !== 'CHANGEAMOUNT')
      throw new Error('Must be option CHANGEAMOUNT');

    let businessRegistryParticipantRegistry = await getParticipantRegistry(namespace + '.' + 'BusinessRegistry');
    let companyRegistry = await getParticipantRegistry(namespace + '.' + 'Company');

    let businessRegistry = await businessRegistryParticipantRegistry.get('0327');
    const company = await companyRegistry.get(changeData.shareholderRegistryID);

    if (tx.response === 'REJECTED') {

      const index = await businessRegistry.receivedChangeOnCompanyRequest.findIndex(request => request.IdToTransactionWithEvent === tx.IdToTransactionWithEvent);
      businessRegistry.receivedChangeOnCompanyRequest.splice(index, 1);

      await businessRegistryParticipantRegistry.update(businessRegistry);

      const companyIndex = await company.changeOnCompanyRequest.findIndex(request => request.IdToTransactionWithEvent === tx.IdToTransactionWithEvent);
      company.changeOnCompanyRequest[companyIndex].response = 'REJECTED';

      await companyRegistry.update(company);

      return "Change on company request was rejected.";
    }

    const stockBookRegistry = await getAssetRegistry(namespace + '.' + 'RegisterOfShareholders');

    const stockBook = await stockBookRegistry.get(changeData.shareholderRegistryID);
    stockBook.numberOfShares = stockBook.numberOfShares + changeData.amountOfNewStocks;

    await stockBookRegistry.update(stockBook);

    let allOwners = [];
    let uniqueOwners = [];
    const queryStringStock = 'resource:org.altinn.RegisterOfShareholders#' + stockBook.orgnr;
    let allStocksForCompany = await query('selectAllStocks', {orgnr: queryStringStock});
    let initialPrice = allStocksForCompany[0].denomination;
    let price = allStocksForCompany[0].value;

    allStocksForCompany.forEach((stock) => {
      allOwners.push(stock.owner)
    });
    allOwners.forEach((owner) => {
      if (uniqueOwners.indexOf(owner) === -1)
        uniqueOwners.push(owner);
    });

    stockBook.capital += (initialPrice * changeData.amountOfNewStocks);
    stockBookRegistry.update(stockBook);

    let stocksPerItem = Math.floor(changeData.amountOfNewStocks / uniqueOwners.length);
    const remainingStocks = changeData.amountOfNewStocks % uniqueOwners.length;

    let stockWithHighestID = await query('selectHighestStockId');
    if (stockWithHighestID.length > 0 && stockWithHighestID !== null && stockWithHighestID.length !== null) {
      stockWithHighestID.sort(function (a, b) {
        var x = parseInt(a.id), y = parseInt(b.id);

        return x > y ? -1 : x < y ? 1 : 0;
      });
      newStockId = parseInt(stockWithHighestID[0].id) + 1;
    } else {
      newStockId = parseInt(1);
    }

    let stockRegistry = await getAssetRegistry(namespace + '.' + 'Stock');

    for (var i = 0; i < uniqueOwners.length; i++) {
      if (i === (uniqueOwners.length - 1)) {
        stocksPerItem += remainingStocks;
      }
      for (var k = 0; k < stocksPerItem; k++) {

        const newId = newStockId.toString();
        const stock = factory.newResource(namespace, 'Stock', newId);
        stock.value = price;
        stock.denomination = initialPrice;
        stock.registerOfShareholders = stockBook;
        stock.type = "";
        stock.owner = uniqueOwners[i];
        stock.marketValue = initialPrice;
        stock.purchasedDate = tx.timestamp;
        await stockRegistry.add(stock);
        newStockId += 1;
      }
    }

    const index = await businessRegistry.receivedChangeOnCompanyRequest.findIndex(request => request.IdToTransactionWithEvent === tx.IdToTransactionWithEvent);
    businessRegistry.receivedChangeOnCompanyRequest.splice(index, 1);

    await businessRegistryParticipantRegistry.update(businessRegistry);

    const companyIndex = await company.changeOnCompanyRequest.findIndex(request => request.IdToTransactionWithEvent === tx.IdToTransactionWithEvent);
    company.changeOnCompanyRequest[companyIndex].response = 'ACCEPTED';

    await companyRegistry.update(company);

    return "Change on company request was rejected.";
  } catch (error) {
    throw new Error('[AddStocks] failed' + error);
  }
}
