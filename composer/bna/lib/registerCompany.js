/**
 * Transaction for changing value of given stocks
 * @param {org.altinn.RegisterCompany} registerCompany - creating a new stockbook for firm
 * @transaction
 */
async function registerCompany(tx) {
  const namespace = CONFIG.composerNamespace;
  const factory = getFactory();

  try {
    const sumDistributedStocks = tx.distribution.reduce((a, b) => a + b, 0);
    if (sumDistributedStocks !== tx.numberOfStock)
      throw new Error(
        'Du har enten delt ut for mange eller for få aksjer i forhold til hva du ønsker å opprette!'
      );
    if (tx.distribution.length !== tx.newStockOwners.length)
      throw new Error(
        'Du har delt ut aksjer til for få eller for mange nye eiere i forhold til hvor mange personer du har skrevet inn som eier av nye aksjer!'
      );

    const request = factory.newConcept(namespace, 'ResponseRequest');
    request.IdToTransactionWithEvent = tx.transactionId;
    request.response = 'PENDING';

    const businessRegistryParticipantRegistry = await getParticipantRegistry(namespace + '.' + 'BusinessRegistry');
    const businessRegistry = await businessRegistryParticipantRegistry.get('0327');
    businessRegistry.receivedEstablishCompanyRequest.push(request);

    await businessRegistryParticipantRegistry.update(businessRegistry);

    const companyRegistry = await getParticipantRegistry(namespace + '.' + 'Company');
    const company = await companyRegistry.get(tx.companyIdentifier);
    company.establishCompanyRequest.push(request);

    await companyRegistry.update(company);

    const StockOwnerRegistry = await getParticipantRegistry(namespace + '.' + 'StockOwner');
    const newStockOwners = [];
    for (const ownerId of tx.newStockOwners) {
      let newStockOwner = await StockOwnerRegistry.get(ownerId);
      newStockOwners.push(newStockOwner);
    }

    const event = factory.newEvent(namespace, 'NewCompanyRegistered');
    event.capital = tx.capital;
    event.numberOfStock = tx.numberOfStock;
    event.distribution = tx.distribution;
    event.company = company;
    event.newStockOwners = newStockOwners;
    event.IdToTransactionWithEvent = tx.transactionId;

    return emit(event);
  } catch (error) {
    throw new Error('[RegisterCompany] failed' + error);
  }
}
