/**
 * Transaction for increasing / decreasing value of Stock belongin to company
 * @param {org.altinn.ExpandCapital} expandCapital - the Stock to be processed
 * @transaction
 */
async function expandCapital(tx) {
  const namespace = CONFIG.composerNamespace;

  try {
    let businessRegistryParticipantRegistry = await getParticipantRegistry(namespace + '.' + 'BusinessRegistry');
    let companyRegistry = await getParticipantRegistry(namespace + '.' + 'Company');
    let stockPurchaceRequest = await query('getStockPurchaseRequest', {id: tx.IdToTransactionWithEvent});
    let changeData = stockPurchaceRequest[0].eventsEmitted[0];

    if (changeData.capitalChange != 'CHANGEVALUE')
      throw new Error('Must be option CHANGEVALUE');


    const businessRegistry = await businessRegistryParticipantRegistry.get('0327');
    const company = await companyRegistry.get(changeData.shareholderRegistryID);

    if (tx.response == 'REJECTED') {
      const index = await businessRegistry.receivedChangeOnCompanyRequest.findIndex(request => request.IdToTransactionWithEvent === tx.IdToTransactionWithEvent);
      businessRegistry.receivedChangeOnCompanyRequest.splice(index, 1);

      await businessRegistryParticipantRegistry.update(businessRegistry);

      const companyIndex = await company.changeOnCompanyRequest.findIndex(request => request.IdToTransactionWithEvent === tx.IdToTransactionWithEvent);
      company.changeOnCompanyRequest[companyIndex].response = 'REJECTED';

      await companyRegistry.update(company);

      return "Change on Company request was rejected.";
    }

    let stockBookRegistry = await getAssetRegistry(namespace + '.' + 'RegisterOfShareholders');
    let stockbook = await stockBookRegistry.get(changeData.shareholderRegistryID);
    stockbook.capital = changeData.newCapital;

    await stockBookRegistry.update(stockbook);

    const newStockValue = changeData.newCapital / stockbook.numberOfShares;
    const queryString = 'resource:org.altinn.RegisterOfShareholders#' + company.orgnr;

    let stockRegistry = await getAssetRegistry(namespace + '.' + 'Stock');
    let allStocksForCompany = await query('selectAllStocks', {orgnr: queryString});
    for (let n = 0; n < allStocksForCompany.length; n++)
      allStocksForCompany[n].value = newStockValue;

    await stockRegistry.updateAll(allStocksForCompany);

    const index = await businessRegistry.receivedChangeOnCompanyRequest.findIndex(request => request.IdToTransactionWithEvent === tx.IdToTransactionWithEvent)
    businessRegistry.receivedChangeOnCompanyRequest.splice(index, 1);

    await businessRegistryParticipantRegistry.update(businessRegistry);

    const companyIndex = await company.changeOnCompanyRequest.findIndex(request => request.IdToTransactionWithEvent === tx.IdToTransactionWithEvent)
    company.changeOnCompanyRequest[companyIndex].response = 'ACCEPTED';

    await companyRegistry.update(company);

    return "Change on Company completed";
  } catch (error) {
    throw new Error('[ExpandCapital] failed' + error);
  }
}
