const createAsset = async function (data, assetType) {
  const nameSpace = CONFIG.composerNamespace;

  try {
    let assetRegistry = await getAssetRegistry(nameSpace + '.' + assetType);

    return await assetRegistry.add(data);
  } catch (error) {
    throw new Error('[CreateAsset] An error occurred while creating the asset: ' + error);
  }
};