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
 * Transaction for creating Stock Owner
 * @param {org.altinn.CreateStockOwner} create Stock Owner
 * @transaction
 */
async function createStockOwner(tx) {
  const namespace = CONFIG.composerNamespace;
  let participantRegistry = await getParticipantRegistry(namespace + '.' + 'StockOwner');

  try {
    await participantRegistry.add(tx.stockOwner);
  } catch (error) {
    throw new Error('[CreateStockOwner] An error occurred while getting the asset registry: ' + error);
  }
}
