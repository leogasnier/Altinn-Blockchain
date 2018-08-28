// 'use strict';
//
// const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
// const AdminConnection = require('composer-admin').AdminConnection;
// const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
// const MemoryCardStore = require('composer-common').MemoryCardStore;
// const IdCard = require('composer-common').IdCard;
// const path = require('path');
// const Builder = require('./builder');
// const BusinessModel = require('./businessModel');
// let Network = require('./network');
// Network = new Network();
//
// const cardStore = new MemoryCardStore();
// let peerAdminConnection;
// let factory;
// let builder;
// let businessNetworkName;
// let adminConnection;
// let businessNetworkDefinition;
// const participants = [];
// const participantsConnections = [];
//
// class TestHelper {
//   constructor() {
//     this.adminCardName = 'admin';
//
//     this.connectionProfile = {
//       name: 'embedded',
//       'x-type': 'embedded'
//     };
//
//     this.credentials = {
//       certificate: 'FAKE CERTIFICATE',
//       privateKey: 'FAKE PRIVATE KEY'
//     };
//
//     this.deployerMetadata = {
//       version: 1,
//       userName: 'PeerAdmin',
//       roles: ['PeerAdmin', 'ChannelAdmin']
//     };
//
//     this.deployerCard = new IdCard(this.deployerMetadata, this.connectionProfile);
//     this.deployerCard.setCredentials(this.credentials);
//     this.deployerCardName = 'PeerAdmin';
//   }
//
//   async initConnection() {
//     peerAdminConnection = new AdminConnection({cardStore: cardStore});
//
//     let result = await peerAdminConnection.hasCard(this.deployerCardName);
//
//     if (result) {
//       await adminConnection;
//     } else {
//       await this.setup();
//     }
//   }
//
//   async setup() {
//     await peerAdminConnection.importCard(this.deployerCardName, this.deployerCard);
//
//     await peerAdminConnection.connect(this.deployerCardName);
//
//     let definition = await BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '../../'));
//
//     businessNetworkDefinition = definition;
//
//     businessNetworkName = await definition.getName();
//
//     await peerAdminConnection.install(businessNetworkName);
//
//     const startOptions = {
//       networkAdmins: [
//         {
//           userName: 'admin',
//           enrollmentSecret: 'adminpw'
//         }
//       ]
//     };
//
//     const adminCards = await peerAdminConnection.start(businessNetworkDefinition, startOptions);
//
//     await peerAdminConnection.importCard(this.adminCardName, adminCards.get('admin'));
//     adminConnection = new BusinessNetworkConnection({cardStore});
//
//     await adminConnection.connect(this.adminCardName);
//     factory = adminConnection.getBusinessNetwork().getFactory();
//
//     builder = new Builder(factory);
//
//     await adminConnection;
//
//     await this.setupParticipants();
//
//     await this.connectParticipants();
//
//     const sampleAssetOne = await this.createSampleAsset('sampleAsset00', 'SampleAdminUser');
//     await this.submitTransaction(await this.getAdminConnection(), sampleAssetOne);
//
//     // const sampleAssetTwo = await this.createSampleAsset('SampleAdminUser');
//     // await this.submitTransaction(await this.getSampleParticipantConnection(), sampleAssetTwo);
//     //
//     // await adminConnection;
//   }
//
//   async createSampleAsset(sampleAssetId, sampleAssetOwner) {
//     const transaction = factory.newTransaction(Network.namespace, BusinessModel.transaction.CreateSampleAsset);
//     transaction.sampleAsset = await builder.buildSampleAsset(sampleAssetId, sampleAssetOwner);
//
//     return transaction;
//   }
//
//   async setupParticipants() {
//     const sampleParticipantRegistry = await adminConnection.getParticipantRegistry(Network.namespace + '.SampleParticipant');
//
//     const sampleParticipantUser = await factory.newResource(Network.namespace, 'SampleParticipant', BusinessModel.user.SampleParticipantUser);
//     sampleParticipantUser.firstName = 'Lapo';
//     sampleParticipantUser.lastName = 'Sample';
//
//     await sampleParticipantRegistry.add(sampleParticipantUser);
//
//     let sampleParticipantIdentity = await adminConnection.issueIdentity(Network.namespace + '.SampleParticipant#SampleParticipantUser', BusinessModel.user.SampleParticipantUser);
//
//     await this.createCardFromIdentity(BusinessModel.user.SampleParticipantUser, sampleParticipantIdentity);
//
//     await participants.push(sampleParticipantIdentity);
//   }
//
//   connectParticipant(participant) {
//     const businessNetworkConnection = new BusinessNetworkConnection({cardStore});
//
//     participantsConnections.push({
//       participantId: participant.userID,
//       connection: businessNetworkConnection
//     });
//
//     return businessNetworkConnection.connect(participant.userID);
//   }
//
//   async connectParticipants() {
//     const connectionPromises = [];
//
//     for (const participant of participants) {
//       connectionPromises.push(this.connectParticipant(participant));
//     }
//
//     return Promise.all(connectionPromises);
//   }
//
//   createCardFromIdentity(cardName, identity) {
//     const metadata = {
//       userName: identity.userID,
//       version: 1,
//       enrollmentSecret: identity.userSecret,
//       businessNetwork: businessNetworkName
//     };
//     const card = new IdCard(metadata, this.connectionProfile);
//
//     return peerAdminConnection.importCard(cardName, card);
//   }
//
//   async getSampleParticipantConnection() {
//     return this.getConnection(BusinessModel.user.SampleParticipantUser);
//   }
//
//   getConnection(participant) {
//     for (const participantConnection of participantsConnections) {
//       if (participantConnection.participantId === participant) {
//         return participantConnection.connection;
//       }
//     }
//
//     throw new Error('Participant doesn\'t have a connection');
//   }
//
//   async createSampleAssetTransaction(sampleAssetId, sampleAssetOwner) {
//     const transaction = factory.newTransaction(Network.namespace, BusinessModel.transaction.CreateSampleAsset);
//     transaction.sampleAsset = await builder.buildSampleAsset(sampleAssetId, sampleAssetOwner);
//
//     return transaction;
//   }
//
//   async updateSampleAssetTransaction(businessNetworkConnection, sampleId) {
//     const transaction = factory.newTransaction(Network.namespace, BusinessModel.transaction.UpdateSampleAsset);
//     transaction.sampleAsset = factory.newRelationship(Network.namespace, 'SampleAsset', sampleId);
//     transaction.newValue = 50;
//
//     await businessNetworkConnection.submitTransaction(transaction);
//   }
//
//   async getAllSampleAssets(businessNetworkConnection) {
//     const assetRegistry = await businessNetworkConnection.getAssetRegistry(Network.namespace + '.SampleAsset');
//
//     return await assetRegistry.getAll();
//   }
//
//   async getSampleAssetFromRegistry(businessNetworkConnection, sampleAssetId) {
//     const assetRegistry = await businessNetworkConnection.getAssetRegistry(Network.namespace + '.SampleAsset');
//
//     return await assetRegistry.get(sampleAssetId);
//   }
//
//   async submitTransaction(businessNetworkConnection, transaction) {
//     return await businessNetworkConnection.submitTransaction(transaction);
//   }
//
//   // Creation of participants
//   async createSampleParticipantTransaction(businessNetworkConnection) {
//     const transaction = factory.newTransaction(Network.namespace, BusinessModel.transaction.CreateSampleParticipant);
//     transaction.sampleParticipant = factory.newResource(Network.namespace, 'SampleParticipant', 'sampleParticipant');
//     transaction.sampleParticipant.firstName = 'firstName';
//     transaction.sampleParticipant.lastName = 'lastName';
//
//     await businessNetworkConnection.submitTransaction(transaction);
//   }
//
//   async getSampleParticipantRegistry(adminConnection) {
//     const participantRegistry = await adminConnection.getParticipantRegistry(Network.namespace + '.SampleParticipant');
//     const participants = await participantRegistry.getAll();
//
//     return participants;
//   }
//
//   async getSampleParticipantById(adminConneciton, sampleParticipantId) {
//     const sampleParticipantRegistry = await adminConnection.getParticipantRegistry(Network.namespace + '.SampleParticipant');
//     return await sampleParticipantRegistry.get(sampleParticipantId);
//
//   }
//
//   async getAdminConnection() {
//     return await adminConnection;
//   }
//
//   getFactory() {
//     return factory;
//   }
// }
//
// TestHelper.constructor = TestHelper;
// module.exports = TestHelper;
