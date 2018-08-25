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
 * Transaction for increasing / decreasing value of Stock belongin to chairmanOfTheBoard
 * @param {org.altinn.ExpandCapital} expandCapital - the Stock to be processed
 * @transaction
 */
async function expandCapital(tx) {
  const namespace = CONFIG.composerNamespace;
  const factory = getFactory();

  try {
    let businessRegistryParticipantRegistry = await getParticipantRegistry(namespace + '.' + 'BusinessRegistry');
    let chairmanOfTheBoardRegistry = await getParticipantRegistry(namespace + '.' + 'ChairmanOfTheBoard');
    let expandCapitalRequest = await query('getTransaction', {transactionId: tx.transactionID});
    let changeData = expandCapitalRequest[0].eventsEmitted[0];

    if (changeData.capitalChange !== 'CHANGEVALUE' && changeData.capitalChange !== 'CHANGEAMOUNT')
      throw new Error('Must be option CHANGEVALUE or CHANGEAMOUNT');

    if (tx.response !== 'REJECTED' && tx.response !== 'ACCEPTED')
      throw new Error('Request Response should be ACCEPTED or REJECTED');

    const allBusinessRegistries = await businessRegistryParticipantRegistry.getAll();
    businessRegistry = allBusinessRegistries[0];

    let stockBookRegistry = await getAssetRegistry(namespace + '.' + 'RegistryOfShareHolders');
    let stockBook = await stockBookRegistry.get(changeData.shareholderRegistryID);
    const chairmanOfTheBoard = await chairmanOfTheBoardRegistry.get(stockBook.chairmanOfTheBoard.getIdentifier());

    allBusinessRegistries.forEach(businessRegistry => {
      const index = businessRegistry.receivedChangeOnCompanyRequest.findIndex(request => request.transactionID === tx.transactionID);
      businessRegistry.receivedChangeOnCompanyRequest.splice(index, 1);
    });

    await businessRegistryParticipantRegistry.updateAll(allBusinessRegistries);

    if (tx.response === 'REJECTED') {
      const chairmanOfTheBoardIndex = await chairmanOfTheBoard.changeOnCompanyRequest.findIndex(request => request.transactionID === tx.transactionID);
      chairmanOfTheBoard.changeOnCompanyRequest[chairmanOfTheBoardIndex].response = 'REJECTED';

      return await chairmanOfTheBoardRegistry.update(chairmanOfTheBoard);
    }

    if (changeData.capitalChange === 'CHANGEVALUE') {
      stockBook.capital += changeData.increasedAmountOfShareCapital;
      stockBook.denomination = stockBook.capital / stockBook.numberOfStocks;

      await stockBookRegistry.update(stockBook);

      const newStockValue = stockBook.capital / stockBook.numberOfStocks;
      const queryString = 'resource:org.altinn.RegistryOfShareHolders#' + stockBook.companyID;

      let stockRegistry = await getAssetRegistry(namespace + '.' + 'Stock');
      let allStocksForCompany = await query('selectAllStocks', {companyID: queryString});
      for (let n = 0; n < allStocksForCompany.length; n++) {
        allStocksForCompany[n].denomination = newStockValue;
        allStocksForCompany[n].previousPrice = allStocksForCompany[n].currentPrice;
        allStocksForCompany[n].currentPrice = newStockValue;
      }

      await stockRegistry.updateAll(allStocksForCompany);

      const chairmanOfTheBoardIndex = await chairmanOfTheBoard.changeOnCompanyRequest.findIndex(request => request.transactionID === tx.transactionID)
      chairmanOfTheBoard.changeOnCompanyRequest[chairmanOfTheBoardIndex].response = 'ACCEPTED';

      return await chairmanOfTheBoardRegistry.update(chairmanOfTheBoard);
    }

    if (changeData.capitalChange === 'CHANGEAMOUNT') {
      let currentStockValue = stockBook.denomination;
      stockBook.capital += changeData.increasedAmountOfShareCapital;
      stockBook.numberOfStocks += changeData.increasedAmountOfShareCapital / currentStockValue;

      await stockBookRegistry.update(stockBook);

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
      changeData.newStockOwners.forEach((owner, index) => {
        for (let i = 0; i < changeData.distribution[index]; i++) {
          const stockId = newStockID.toString();
          const stock = factory.newResource(namespace, 'Stock', stockId);
          stock.denomination = currentStockValue;
          stock.currentPrice = changeData.purchasedValuesOfStocks[index];
          stock.registryOfShareHolders = stockBook;
          stock.type = "";
          stock.purchasedDate = tx.timestamp;
          stock.owner = factory.newRelationship(namespace, 'StockOwner', owner);
          newStocks.push(stock);
          newStockID += 1;
        }
      });

      await stockRegistry.addAll(newStocks);

      const index = await businessRegistry.receivedChangeOnCompanyRequest.findIndex(request => request.transactionID === tx.transactionID);
      businessRegistry.receivedChangeOnCompanyRequest.splice(index, 1);

      await businessRegistryParticipantRegistry.update(businessRegistry);

      const chairmanOfTheBoardIndex = await chairmanOfTheBoard.changeOnCompanyRequest.findIndex(request => request.transactionID === tx.transactionID);
      chairmanOfTheBoard.changeOnCompanyRequest[chairmanOfTheBoardIndex].response = 'ACCEPTED';

      return await chairmanOfTheBoardRegistry.update(chairmanOfTheBoard);
    }
  } catch (error) {
    throw new Error('[ExpandCapital] failed' + error);
  }
}
