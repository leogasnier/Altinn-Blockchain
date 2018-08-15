# Loopback composer boilerplate Network

> This folder contains the Business Network Archive, which demonstrates the core functionality of Hyperledger Composer by changing the value of an asset. 

Composer contains Transaction logic```(lib/...rules.js)```, business network definition ```(businessModel.cto)```, 
permissions ```(permissions.acl)```, queries ```(queries.qry)```, unit tests ```test/....UnitTest.js``` and feature tests ```(features/sample.feature)``` for the generic network.

The business network defines:

**Participants**
`SampleParticipant`

**Entities**
`Entity`

**Assets**
`SampleAsset`

**Transactions**
`SampleTransaction`

**Events**
`SampleEvent`

**Concepts**
`Creation`

**Enums**
`Status`

SampleAssets are owned by a SampleParticipant, and the value property on a SampleAsset can be modified by submitting a SampleTransaction. The SampleTransaction emits a SampleEvent that notifies applications of the old and new values for each modified SampleAsset.

To test the Transactions and Permissions, unit tests have been created.
In composer 0.19.14, it is possible to issue identities and test that functionality is doing what it supposed to do.