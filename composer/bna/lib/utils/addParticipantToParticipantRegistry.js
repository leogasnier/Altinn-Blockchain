const addParticipantToParticipantRegistry = async function (participantData, participantType) {
  const nameSpace = CONFIG.composerNamespace;

  try {
    let participantRegistry = await getParticipantRegistry(nameSpace + '.' + participantType);
    await participantRegistry.add(participantData);
  } catch (error) {
    throw new Error('Create participant' + participantType + ' An error occurred while getting the asset registry: ' + error);
  }
};