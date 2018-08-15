/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
const BusinessModel = require('./businessModel');
let Network = require('./network');
Network = new Network();


class Builder {
  constructor(factory) {
    this.factory = factory;
  }

  buildSampleAsset(sampleAssetId, sampleAssetOwner) {
    const sampleAsset = this.factory.newResource(Network.namespace, 'SampleAsset', sampleAssetId);
    sampleAsset.creation = this.factory.newConcept(Network.namespace, 'Creation');
    sampleAsset.creation.date = 101010;
    sampleAsset.value = 10;
    sampleAsset.supplier = 'a supplier';
    sampleAsset.owner = this.factory.newRelationship(Network.namespace, 'SampleOrg', sampleAssetOwner);
    sampleAsset.status = BusinessModel.sampleStatus.Created;

    return sampleAsset;
  }
}

Builder.constructor = Builder;
module.exports = Builder;