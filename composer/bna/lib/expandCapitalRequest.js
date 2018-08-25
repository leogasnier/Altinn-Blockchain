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
 * Transaction for requesting increase of amount of share capital
 * @param {org.altinn.ExpandCapitalRequest} expandCapitalRequest - creating a new expand capital request
 * @transaction
 */
async function expandCapitalRequest(tx) {
  const namespace = CONFIG.composerNamespace;
  const currentParticipant = getCurrentParticipant();
  const factory = getFactory();

  try {
    let businessRegistryParticipantRegistry = await getParticipantRegistry(namespace + '.' + 'BusinessRegistry');
    let chairmanOfTheBoardRegistry = await getParticipantRegistry(namespace + '.' + 'ChairmanOfTheBoard');
    let stockOwnersRegistry = await getParticipantRegistry(namespace + '.' + 'StockOwner');

    let stockBookRegistry = await getAssetRegistry(namespace + '.' + 'RegistryOfShareHolders');
    let stockBook = await stockBookRegistry.get(tx.shareholderRegistryID);

    if (currentParticipant.getIdentifier() !== stockBook.chairmanOfTheBoard.getIdentifier())
      throw new Error('Only Chairman of the board of this company can make expand capital request transaction!');

    if (tx.capitalChange === 'CHANGEAMOUNT') {
      if (tx.increasedAmountOfShareCapital % stockBook.denomination !== 0)
        throw new Error('Please enter increased amount of share capital multiple to the denomination: ' + stockBook.denomination);

      const numberOfNewStocks = tx.increasedAmountOfShareCapital / stockBook.denomination;
      const sumDistributedStocks = tx.distribution.reduce((a, b) => a + b, 0);

      if (sumDistributedStocks !== numberOfNewStocks)
        throw new Error(
          'The amount of stocks needs to be equal to the number of stocks that will be created with the increased amount of share capital transaction: '
          + numberOfNewStocks
        );
      if (tx.newStockOwners.length === 0)
        throw new Error('Please enter new stock owners!');

      if (tx.newStockOwners.length !== tx.purchasedValuesOfStocks.length)
        throw new Error('Please enter stock puchased values for each stock owner!');

      for (let i = 0; i < tx.newStockOwners.length; i++) {
        let stockOwner = await stockOwnersRegistry.get(tx.newStockOwners[i]);
        if (!stockOwner)
          throw new Error('Stock Owner with ID: ' + tx.newStockOwners[i] + 'does not exist!')
      }

      let request = factory.newConcept(namespace, 'ResponseRequest');
      request.transactionID = tx.transactionId;
      request.request = tx.capitalChange;
      request.response = 'PENDING';

      const allBusinessRegistries = await businessRegistryParticipantRegistry.getAll();
      allBusinessRegistries.forEach(businessRegistry => {
        businessRegistry.receivedChangeOnCompanyRequest.push(request);
      });

      await businessRegistryParticipantRegistry.updateAll(allBusinessRegistries);

      const chairmanOfTheBoard = await chairmanOfTheBoardRegistry.get(currentParticipant.getIdentifier());
      chairmanOfTheBoard.changeOnCompanyRequest.push(request);

      await chairmanOfTheBoardRegistry.update(chairmanOfTheBoard);

      const event = factory.newEvent(namespace, 'ChangeOnCompanyRegistered');
      event.capitalChange = tx.capitalChange;
      event.increasedAmountOfShareCapital = tx.increasedAmountOfShareCapital;
      event.shareholderRegistryID = tx.shareholderRegistryID;
      event.distribution = tx.distribution;
      event.purchasedValuesOfStocks = tx.purchasedValuesOfStocks;
      event.newStockOwners = tx.newStockOwners;

      return emit(event);
    }

    let request = factory.newConcept(namespace, 'ResponseRequest');
    request.transactionID = tx.transactionId;
    request.request = tx.capitalChange;
    request.response = 'PENDING';

    const allBusinessRegistries = await businessRegistryParticipantRegistry.getAll();
    allBusinessRegistries.forEach(businessRegistry => {
      businessRegistry.receivedChangeOnCompanyRequest.push(request);
    });

    await businessRegistryParticipantRegistry.updateAll(allBusinessRegistries);

    const chairmanOfTheBoard = await chairmanOfTheBoardRegistry.get(currentParticipant.getIdentifier());
    chairmanOfTheBoard.changeOnCompanyRequest.push(request);

    await chairmanOfTheBoardRegistry.update(chairmanOfTheBoard);

    const event = factory.newEvent(namespace, 'ChangeOnCompanyRegistered');
    event.capitalChange = tx.capitalChange;
    event.increasedAmountOfShareCapital = tx.increasedAmountOfShareCapital;
    event.shareholderRegistryID = tx.shareholderRegistryID;

    return emit(event);
  } catch (error) {
    throw new Error('[ExpandCapitalRequest] failed' + error);
  }
}
