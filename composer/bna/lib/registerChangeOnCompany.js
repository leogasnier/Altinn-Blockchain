/**
 * Transaction for changing value of given stocks
 * @param {org.altinn.RegisterChangeOnCompany} registerChangeOnCompany - creating a new stockbook for firm
 * @transaction
 */
async function registerChangeOnCompany(tx) {
  const namespace = CONFIG.composerNamespace;
  const factory = getFactory();

  try {
    let businessRegistryParticipantRegistry = await getParticipantRegistry(namespace + '.' + 'BusinessRegistry');
    let companyRegistry = await getParticipantRegistry(namespace + '.' + 'Company');

    let request = factory.newConcept(namespace, 'ResponseRequest');
    request.IdToTransactionWithEvent = tx.transactionId;
    request.response = 'PENDING';

    let businessRegistry = await businessRegistryParticipantRegistry.get('0327');
    businessRegistry.receivedChangeOnCompanyRequest.push(request);

    await businessRegistryParticipantRegistry.update(businessRegistry);

    const company = await companyRegistry.get(tx.shareholderRegistryID);
    company.changeOnCompanyRequest.push(request);

    await companyRegistry.update(company);

    const event = factory.newEvent(namespace, 'ChangeOnCompanyRegistered');
    event.capitalChange = tx.capitalChange;
    event.newCapital = tx.newCapital;
    event.amountOfNewStocks = tx.amountOfNewStocks;
    event.shareholderRegistryID = tx.shareholderRegistryID;

    return emit(event);
  } catch (error) {
    throw new Error('[RegisterChangeOnCompany] failed' + error);
  }
}
