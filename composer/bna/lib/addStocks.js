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
 * Increasing the amountOfNewStocks of aksjer in aksjebok and distributes among shareholders.
 * @param {org.altinn.AddStocks} addStocks - registryOfShareHolders creates stock.
 * @transaction
 */
async function addStocks(tx) {
  const namespace = CONFIG.composerNamespace;
  const currentParticipant = getCurrentParticipant();
  const factory = getFactory();

  try {
    const stockPurchaseRequest = await query('getStockPurchaseRequest', {id: tx.transactionID});
    const changeData = stockPurchaseRequest[0].eventsEmitted[0];
    let companyRegistry = await getParticipantRegistry(namespace + '.' + 'Company');
    const company = await companyRegistry.get(changeData.shareholderRegistryID);

    if (currentParticipant.getIdentifier() !== company.chairmanOfTheBoard.getIdentifier())
      throw new Error('Only Chairman of the Board of this company can add stocks!');

    if (changeData.capitalChange !== 'CHANGEAMOUNT')
      throw new Error('Must be option CHANGEAMOUNT');

    if (tx.response !== 'REJECTED' && tx.response !== 'ACCEPTED')
      throw new Error('Request Response should be ACCEPTED or REJECTED');

    let businessRegistryParticipantRegistry = await getParticipantRegistry(namespace + '.' + 'BusinessRegistry');

    const allBusinessRegistries = await businessRegistryParticipantRegistry.getAll();
    businessRegistry = allBusinessRegistries[0];

    if (tx.response === 'REJECTED') {

      const index = await businessRegistry.receivedChangeOnCompanyRequest.findIndex(request => request.transactionID === tx.transactionID);
      businessRegistry.receivedChangeOnCompanyRequest.splice(index, 1);

      await businessRegistryParticipantRegistry.update(businessRegistry);

      const companyIndex = await company.changeOnCompanyRequest.findIndex(request => request.transactionID === tx.transactionID);
      company.changeOnCompanyRequest[companyIndex].response = 'REJECTED';

      await companyRegistry.update(company);

      return "Change on company request was rejected.";
    }

    const stockBookRegistry = await getAssetRegistry(namespace + '.' + 'RegistryOfShareHolders');
    const stockBook = await stockBookRegistry.get(changeData.shareholderRegistryID);
    stockBook.numberOfShares = stockBook.numberOfShares + changeData.amountOfNewStocks;

    await stockBookRegistry.update(stockBook);

    let allOwners = [];
    const queryStringStock = 'resource:org.altinn.RegistryOfShareHolders#' + stockBook.companyID;
    let allStocksForCompany = await query('selectAllStocks', {companyID: queryStringStock});
    let initialPrice = allStocksForCompany[0].denomination;
    let price = allStocksForCompany[0].value;

    allStocksForCompany.forEach((stock) => {
      allOwners.push(stock.owner.getIdentifier());
    });
    uniqueOwners = allOwners.filter((x, i, a) => a.indexOf(x) === i);

    stockBook.capital += (price * changeData.amountOfNewStocks);
    await stockBookRegistry.update(stockBook);

    let stocksPerItem = Math.floor(changeData.amountOfNewStocks / uniqueOwners.length);
    const remainingStocks = changeData.amountOfNewStocks % uniqueOwners.length;

    let stockWithHighestID = await query('selectHighestStockId');
    if (stockWithHighestID.length > 0 && stockWithHighestID !== null && stockWithHighestID.length !== null) {
      stockWithHighestID.sort(function (a, b) {
        var x = parseInt(a.stockID), y = parseInt(b.stockID);

        return x > y ? -1 : x < y ? 1 : 0;
      });
      newStockId = parseInt(stockWithHighestID[0].stockID) + 1;
    } else {
      newStockId = parseInt(1);
    }

    let stockRegistry = await getAssetRegistry(namespace + '.' + 'Stock');
    let newStocks = [];
    for (var i = 0; i < uniqueOwners.length; i++) {
      if (i === (uniqueOwners.length - 1)) {
        stocksPerItem += remainingStocks;
      }
      for (var k = 0; k < stocksPerItem; k++) {

        const newId = newStockId.toString();
        const stock = factory.newResource(namespace, 'Stock', newId);
        stock.value = price;
        stock.denomination = initialPrice;
        stock.registryOfShareHolders = stockBook;
        stock.type = "";
        stock.owner = factory.newRelationship(namespace, 'StockOwner', uniqueOwners[i]);
        stock.marketValue = initialPrice;
        stock.purchasedDate = tx.timestamp;
        newStocks.push(stock);
        newStockId += 1;
      }
    }

    await stockRegistry.addAll(newStocks);

    const index = await businessRegistry.receivedChangeOnCompanyRequest.findIndex(request => request.transactionID === tx.transactionID);
    businessRegistry.receivedChangeOnCompanyRequest.splice(index, 1);

    await businessRegistryParticipantRegistry.update(businessRegistry);

    const companyIndex = await company.changeOnCompanyRequest.findIndex(request => request.transactionID === tx.transactionID);
    company.changeOnCompanyRequest[companyIndex].response = 'ACCEPTED';

    await companyRegistry.update(company);

    return "Change on company request was rejected.";
  } catch (error) {
    throw new Error('[AddStocks] failed' + error);
  }
}
