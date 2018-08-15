let ParticipantHelper = function () {
  this.factory = getFactory();
  this.currentParticipant = getCurrentParticipant();
  this.namespace = CONFIG.composerNamespace;
};

ParticipantHelper.prototype.getCurrentParticipantOrg = async function () {
  return this.currentParticipant.org;
};