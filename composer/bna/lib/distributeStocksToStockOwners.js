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
 * Transaction for creating stocks for stock owners
 * @param {org.altinn.DistributeStocksToStockOwners} distributeStocksToStockOwners - creating stocks for stock owners
 * @transaction
 */
async function distributeStocksToStockOwners(tx) {
  const namespace = CONFIG.composerNamespace;
  const currentParticipant = getCurrentParticipant();
  const factory = getFactory();

  try {
    let registryOfShareHoldersRegistry = await getAssetRegistry(namespace + '.' + 'RegistryOfShareHolders');
    let stockOwnersRegistry = await getParticipantRegistry(namespace + '.' + 'StockOwner');
    let registryOfShareHolders = await registryOfShareHoldersRegistry.get(tx.companyID);

    if (!registryOfShareHolders)
      throw new Error('Registry of Share Holders does not exist!');

    if (registryOfShareHolders.stocksAreDistributed === true)
      throw new Error('Stocks for this company have been already distributed!');

    if (registryOfShareHolders.chairmanOfTheBoard.getIdentifier() !== currentParticipant.getIdentifier())
      throw new Error('Only Chairman of the Board of this company can distribute stocks to Stock Owners!');

    const sumDistributedStocks = tx.distribution.reduce((a, b) => a + b, 0);
    if (sumDistributedStocks !== registryOfShareHolders.numberOfStocks)
      throw new Error(
        'The amount of distributed stocks needs to be equal to the number of available stocks in the company! '
      );

    for (let i = 0; i < tx.newStockOwners.length; i++) {
      let stockOwner = await stockOwnersRegistry.get(tx.newStockOwners[i]);
      if (!stockOwner)
        throw new Error('Stock Owner with ID: ' + tx.newStockOwners[i] + 'does not exist!')
    }

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
    tx.newStockOwners.forEach((owner, index) => {
      for (let i = 0; i < tx.distribution[index]; i++) {
        const stockId = newStockID.toString();
        const stock = factory.newResource(namespace, 'Stock', stockId);
        stock.denomination = registryOfShareHolders.denomination;
        stock.currentPrice = tx.purchasedValuesOfStocks[index];
        stock.registryOfShareHolders = registryOfShareHolders;
        stock.type = "";
        stock.purchasedDate = tx.timestamp;
        stock.owner = factory.newRelationship(namespace, 'StockOwner', owner);
        newStocks.push(stock);
        newStockID += 1;
      }
    });

    await stockRegistry.addAll(newStocks);

    registryOfShareHolders.stocksAreDistributed = true;

    return await registryOfShareHoldersRegistry.update(registryOfShareHolders);
  } catch (error) {
    throw new Error('[DistributeStocksToStockOwners] failed' + error);
  }
}
