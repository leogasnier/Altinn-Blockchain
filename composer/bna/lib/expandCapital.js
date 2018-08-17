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
 * Transaction for increasing / decreasing value of Stock belongin to company
 * @param {org.altinn.ExpandCapital} expandCapital - the Stock to be processed
 * @transaction
 */
async function expandCapital(tx) {
  const namespace = CONFIG.composerNamespace;

  try {
    let businessRegistryParticipantRegistry = await getParticipantRegistry(namespace + '.' + 'BusinessRegistry');
    let companyRegistry = await getParticipantRegistry(namespace + '.' + 'Company');
    let stockPurchaceRequest = await query('getStockPurchaseRequest', {id: tx.transactionID});
    let changeData = stockPurchaceRequest[0].eventsEmitted[0];

    if (changeData.capitalChange !== 'CHANGEVALUE')
      throw new Error('Must be option CHANGEVALUE');

    if (tx.response !== 'REJECTED' && tx.response !== 'ACCEPTED')
      throw new Error('Request Response should be ACCEPTED or REJECTED');

    const allBusinessRegistries = await businessRegistryParticipantRegistry.getAll();
    businessRegistry = allBusinessRegistries[0];
    const company = await companyRegistry.get(changeData.shareholderRegistryID);

    if (tx.response === 'REJECTED') {
      const index = await businessRegistry.receivedChangeOnCompanyRequest.findIndex(request => request.transactionID === tx.transactionID);
      businessRegistry.receivedChangeOnCompanyRequest.splice(index, 1);

      await businessRegistryParticipantRegistry.update(businessRegistry);

      const companyIndex = await company.changeOnCompanyRequest.findIndex(request => request.transactionID === tx.transactionID);
      company.changeOnCompanyRequest[companyIndex].response = 'REJECTED';

      await companyRegistry.update(company);

      return "Change on Company request was rejected.";
    }

    let stockBookRegistry = await getAssetRegistry(namespace + '.' + 'RegistryOfShareHolders');
    let stockbook = await stockBookRegistry.get(changeData.shareholderRegistryID);
    stockbook.capital = changeData.newCapital;

    await stockBookRegistry.update(stockbook);

    const newStockValue = changeData.newCapital / stockbook.numberOfShares;
    const queryString = 'resource:org.altinn.RegistryOfShareHolders#' + company.companyID;

    let stockRegistry = await getAssetRegistry(namespace + '.' + 'Stock');
    let allStocksForCompany = await query('selectAllStocks', {companyID: queryString});
    for (let n = 0; n < allStocksForCompany.length; n++)
      allStocksForCompany[n].value = newStockValue;

    await stockRegistry.updateAll(allStocksForCompany);

    const index = await businessRegistry.receivedChangeOnCompanyRequest.findIndex(request => request.transactionID === tx.transactionID)
    businessRegistry.receivedChangeOnCompanyRequest.splice(index, 1);

    await businessRegistryParticipantRegistry.update(businessRegistry);

    const companyIndex = await company.changeOnCompanyRequest.findIndex(request => request.transactionID === tx.transactionID)
    company.changeOnCompanyRequest[companyIndex].response = 'ACCEPTED';

    await companyRegistry.update(company);

    return "Change on Company completed";
  } catch (error) {
    throw new Error('[ExpandCapital] failed' + error);
  }
}
