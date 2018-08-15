/**
 * Transaction for creating Stock Owner
 * @param {org.altinn.CreateStockOwner} create Stock Owner
 * @transaction
 */

async function createStockOwner(tx) {
  let participantRegistry = await getParticipantRegistry('org.altinn.StockOwner');

  try {
    await participantRegistry.add(tx.stockOwner);
  } catch (error) {
    throw new Error('[CreateStockOwner] Failed: ' + error);
  }
}
