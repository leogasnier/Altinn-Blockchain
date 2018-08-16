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
 * Create CreateChairmanOfTheBoard transaction processor function.
 * @param {org.altinn.CreateBusinessRegistry} tx  - CreateBusinessRegistry transaction
 * @return {Promise} Participant registry Promise
 * @transaction
 */
async function createBusinessRegistry(tx) {
  const namespace = CONFIG.composerNamespace;
  const factory = getFactory();

  let newBusinessRegistry = factory.newResource(namespace, 'BusinessRegistry', tx.businessRegistryID);
  newBusinessRegistry.firstName = tx.firstName;
  newBusinessRegistry.lastName = tx.lastName;
  newBusinessRegistry.receivedEstablishCompanyRequest = [];
  newBusinessRegistry.receivedChangeOnCompanyRequest = [];

  return addParticipantToParticipantRegistry(newBusinessRegistry, 'BusinessRegistry');
}
