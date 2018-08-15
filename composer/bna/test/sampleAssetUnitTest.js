// /*
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  * http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */
//
// 'use strict';
//
// const AdminConnection = require('composer-admin').AdminConnection;
// const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
// const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
// const IdCard = require('composer-common').IdCard;
// const MemoryCardStore = require('composer-common').MemoryCardStore;
// const path = require('path');
// const TestHelper = require('./common/testhelper');
// let Network = require('./common/network');
// const chai = require('chai');
// chai.should();
// chai.use(require('chai-as-promised'));
// Network = new Network();
// const BusinessModel = require('./common/businessModel');
// let Builder = require('./common/builder');
//
// describe('Sample', () => {
//   let helper;
//
//   beforeEach(async () => {
//     helper = await new TestHelper();
//
//     await helper.initConnection();
//   });
//
//   it('SampleAdminUser can get all assets where he is the owner', async () => {
//     // Use the identity for SampleAdminUser.
//     const assets = await helper.getAllSampleAssets(await helper.getAdminConnection());
//
//     const result = assets.find(asset => (asset.owner.getFullyQualifiedIdentifier() === Network.namespace + '.SampleOrg#SampleAdminUser'));
//     result.owner.getIdentifier().should.equal('SampleAdminUser');
//     assets.should.have.lengthOf(1);
//   });
//
//   it('SampleAdminUser can submit a CreateSampleAsset transaction to create assets where he is the owner', async () => {
//     // Use the identity for SampleAdminUser.
//     const transaction = await helper.createSampleAssetTransaction('sampleAsset01', 'SampleAdminUser');
//     await helper.submitTransaction(await helper.getAdminConnection(), transaction);
//     const assetRegistry = await helper.getSampleAssetFromRegistry(await helper.getAdminConnection(), 'sampleAsset01');
//     assetRegistry.getIdentifier().should.equal('sampleAsset01');
//   });
//
//   it('SampleAdminUser can submit an UpdateSampleAsset transaction for assets where he is the owner', async () => {
//     const adminConnection = await helper.getAdminConnection();
//     let events = [];
//     adminConnection.on('event', event => {
//       events.push(event);
//     });
//
//     await helper.updateSampleAssetTransaction(adminConnection, 'sampleAsset00');
//     let sampleAsset = await helper.getSampleAssetFromRegistry(adminConnection, 'sampleAsset00');
//
//     sampleAsset.owner.getFullyQualifiedIdentifier().should.equal(Network.namespace + '.SampleOrg#SampleAdminUser');
//     sampleAsset.value.should.equal(50);
//
//     // Events
//     events.should.have.lengthOf(1);
//     const event = events[0];
//     event.eventId.should.be.a('string');
//     event.timestamp.should.be.an.instanceOf(Date);
//     event.sampleAsset.getFullyQualifiedIdentifier().should.equal(Network.namespace + '.SampleAsset#sampleAsset00');
//     event.oldValue.should.equal(10);
//     event.newValue.should.equal(50);
//   });
//
//   it('SampleAdminUser can submit a CreateSampleParticipant transaction to create participants', async () => {
//     const adminConnection = await helper.getAdminConnection();
//     await helper.createSampleParticipantTransaction(adminConnection);
//     const result = await helper.getSampleParticipantById(adminConnection, 'SampleParticipantUser');
//     result.userID.should.equal('SampleParticipantUser');
//   });
// });