/**
 * Transaction for changing value of given stocks
 * @param {org.altinn.ChangeStockValue} changeStockValue - RegisterOfShareholders whos stocks is changing value
 * @transaction
 */
async function changeStockValue(tx) {
  const namespace = CONFIG.composerNamespace;
  const factory = getFactory();

  try {
    let stockRegistry = await getAssetRegistry(namespace + '.' + 'Stock');
    const queryString = 'resource:org.altinn.RegisterOfShareholders#' + tx.registerOfShareholders;
    let allStocksForCompany = await query('selectAllStocks', {orgnr: queryString});

    for (let n = 0; n < allStocksForCompany.length; n++) {
      allStocksForCompany[n].value = tx.newValue;
    }

    await stockRegistry.updateAll(allStocksForCompany);

    let event = factory.newEvent(namespace, 'StockChangedValue');
    event.stock = allStocksForCompany[0];
    event.oldValue = event.stock.value;
    event.newValue = tx.newValue;
    event.message = 'Stock has changed value.';

    return emit(event);
  } catch (error) {
    throw new Error('[ChangeStockValue] failed' + error);
  }
}
