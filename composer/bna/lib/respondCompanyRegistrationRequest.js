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
 * Transaction for creating a Company
 * @param {org.altinn.ProcessCompanyRegistrationRequest} createCompany - creating a new stockBook for firm
 * @transaction
 */
async function processCompanyRegistrationRequest(tx) {
  const namespace = CONFIG.composerNamespace;
  const factory = getFactory();

  try {
    if (tx.response !== 'REJECTED' && tx.response !== 'ACCEPTED')
      throw new Error('Request Response should be ACCEPTED or REJECTED');

    let businessRegistryParticipantRegistry = await getParticipantRegistry(namespace + '.' + 'BusinessRegistry');
    let companyRegistry = await getParticipantRegistry(namespace + '.' + 'Company');


    const stockPurchaseRequests = await query('getStockPurchaseRequest', {id: tx.transactionID});
    const requestData = stockPurchaseRequests[0].eventsEmitted[0];

    const BusinessRegistry = await businessRegistryParticipantRegistry.get('0327');
    const companyID = requestData.company.getIdentifier();
    const companyRelation = requestData.company;
    const company = await companyRegistry.get(companyID);


    if (tx.response === 'REJECTED') {

      const index = await BusinessRegistry.receivedEstablishCompanyRequest.findIndex(request => request.transactionID === requestData.transactionID);
      BusinessRegistry.receivedEstablishCompanyRequest.splice(index, 1);

      await businessRegistryParticipantRegistry.update(BusinessRegistry);


      const companyIndex = await company.establishCompanyRequest.findIndex(request => request.transactionID === requestData.transactionID);
      company.establishCompanyRequest[companyIndex].response = 'REJECTED';

      await companyRegistry.update(company);

      return "Establish company request was rejected.";
    }

    let stockBook = factory.newResource(namespace, 'RegisterOfShareholders', companyID);
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
        var x = parseInt(a.stockID), y = parseInt(b.stockID);

        return x > y ? -1 : x < y ? 1 : 0;
      });
      newStockID = parseInt(stockWithHighestID[0].stockID) + 1;
    } else {
      newStockID = parseInt(1);
    }

    let stockRegistry = await getAssetRegistry(namespace + '.' + 'Stock');
    let newStocks = [];
    requestData.newStockOwners.forEach((owner, index) => {
      for (let i = 0; i < requestData.distribution[index]; i++) {
        const stockId = newStockID.toString();
        const stock = factory.newResource(namespace, 'Stock', stockId);
        stock.value = stockBook.firstDenomination;
        stock.denomination = stockBook.firstDenomination;
        stock.marketValue = stockBook.firstDenomination;
        stock.registerOfShareholders = stockBook;
        stock.type = "";
        stock.purchasedDate = requestData.timestamp;
        stock.owner = owner;
        newStocks.push(stock);
        newStockID += 1;
      }
    });

    await stockRegistry.addAll(newStocks);

    const index = await BusinessRegistry.receivedEstablishCompanyRequest.findIndex(request => request.transactionID === requestData.transactionID);
    BusinessRegistry.receivedEstablishCompanyRequest.splice(index, 1);

    await businessRegistryParticipantRegistry.update(BusinessRegistry);

    company.establishCompanyRequest.find(request => request.transactionID === requestData.transactionID).response = 'ACCEPTED';

    await companyRegistry.update(company);

    return "Establish company request was ACCEPTED.";
  } catch (error) {
    throw new Error('[ProcessCompanyRegistrationRequest] failed' + error);
  }
}
