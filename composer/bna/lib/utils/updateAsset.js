const updateAsset = async function (data, assetType) {
  const nameSpace = CONFIG.composerNamespace;

  try {
    let assetRegistry = await getAssetRegistry(nameSpace + '.' + assetType);

    return await assetRegistry.update(data);
  } catch (error) {
    throw new Error('[UpdateAsset] An error occurred while updating the asset: ' + error);
  }
};