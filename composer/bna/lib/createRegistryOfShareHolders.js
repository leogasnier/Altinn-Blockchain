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
 * Transaction for creating a Registry of ShareHolders
 * @param {org.altinn.CreateRegistryOfShareHolders} createRegistryOfShareHolders - creating a new stockBook for firm
 * @transaction
 */
async function createRegistryOfShareHolders(tx) {
  const namespace = CONFIG.composerNamespace;
  const factory = getFactory();

  try {
    let chairmanOfTheBoardRegistry = await getParticipantRegistry(namespace + '.' + 'ChairmanOfTheBoard');
    let chairmanOfTheBoard = await chairmanOfTheBoardRegistry.get(tx.chairmanOfTheBoardID);

    if (!chairmanOfTheBoard)
      throw new Error('Chairman of the Board with ID: ' + tx.chairmanOfTheBoardID + ' does not exist!');

    if (tx.capital <= 0)
      throw new Error('Please enter a valid capital!');

    if (tx.numberOfStocks <= 0)
      throw new Error('Please enter a valid number of stocks!');

    let newRegistryOfShareHolders = factory.newResource(namespace, 'RegistryOfShareHolders', tx.companyID);
    newRegistryOfShareHolders.companyName = tx.companyName;
    newRegistryOfShareHolders.capital = tx.capital;
    newRegistryOfShareHolders.numberOfStocks = tx.numberOfStocks;
    newRegistryOfShareHolders.denomination = tx.capital / tx.numberOfStocks;
    newRegistryOfShareHolders.stocksAreDistributed = false;
    newRegistryOfShareHolders.chairmanOfTheBoard = factory.newRelationship(namespace, 'ChairmanOfTheBoard', tx.chairmanOfTheBoardID);

    let registryOfShareHoldersRegistry = await getAssetRegistry(namespace + '.' + 'RegistryOfShareHolders');

    return await registryOfShareHoldersRegistry.add(newRegistryOfShareHolders);
  } catch (error) {
    throw new Error('[CreateRegistryOfShareHolders] failed' + error);
  }
}
