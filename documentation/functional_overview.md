## Functional Overview
The main components used in this application are Hyperledger Fabric v1.1, Hyperledger Composer v0.19.14 and Loopback server. 

### Hyperledger Fabric v1.1
Hyperledger Fabric is a platform for distributed ledger solutions, underpinned by a modular architecture delivering high degrees of confidentiality, resiliency, flexibility and scalability. It is designed to support pluggable implementations of different components, and accommodate the complexity and intricacies that exist across the economic ecosystem.
Hyperledger Fabric delivers a uniquely elastic and extensible architecture, distinguishing it from alternative blockchain solutions. 
1. Nodes
Nodes are the communication entities of the blockchain. A “node” is only a logical function in the sense that multiple nodes of different types can run on the same physical server. What counts is how nodes are grouped in “trust domains” and associated to logical entities that control them.
There are three types of nodes:
1.	Client or submitting-client: a client that submits an actual transaction-invocation to the endorsers, and broadcasts transaction-proposals to the ordering service.
2.	Peer: a node that commits transactions and maintains the state and a copy of the ledger (see Sec, 1.2). Besides, peers can have a special endorser role.
3.	Ordering-service-node or orderer: a node running the communication service that implements a delivery guarantee, such as atomic or total order broadcast.

##### Client
The client represents the entity that acts on behalf of an end-user. It must connect to a peer for communicating with the blockchain. The client may connect to any peer of its choice. Clients create and thereby invoke transactions.
##### Peer
A peer receives ordered state updates in the form of blocks from the ordering service and maintain the state and the ledger.
Peers can additionally take up a special role of an endorsing peer, or an endorser. The special function of an endorsing peer occurs with respect to a particular chaincode and consists in endorsing a transaction before it is committed. Every chaincode may specify an endorsement policy that may refer to a set of endorsing peers. The policy defines the necessary and sufficient conditions for a valid transaction endorsement (typically a set of endorsers’ signatures. In the special case of deploy transactions that install new chaincode the (deployment) endorsement policy is specified as an endorsement policy of the system chaincode.
##### Ordering service nodes (Orderers)
The orderers form the ordering service, i.e., a communication fabric that provides delivery guarantees. The ordering service can be implemented in different ways: ranging from a centralized service (used e.g., in development and testing) to distributed protocols that target different network and node fault models.

More information about the architecture of Hyperledger Fabric v1.1 can be found in the following link: https://hyperledger-fabric.readthedocs.io/en/release-1.1/arch-deep-dive.html

### Hyperledger Composer v0.19.14

Hyperledger Composer is an extensive, open development toolset and framework to make developing blockchain applications easier. Our primary goal is to accelerate time to value, and make it easier to integrate your blockchain applications with the existing business systems. You can use Composer to rapidly develop use cases and deploy a blockchain solution in weeks rather than months. Composer allows you to model your business network and integrate existing systems and data with your blockchain applications.
Hyperledger Composer supports the existing Hyperledger Fabric blockchain infrastructure and runtime, which supports pluggable blockchain consensus protocols to ensure that transactions are validated according to policy by the designated business network participants.
Everyday applications can consume the data from business networks, providing end users with simple and controlled access points.
You can use Hyperledger Composer to quickly model your current business network, containing your existing assets and the transactions related to them; assets are tangible or intangible goods, services, or property. As part of your business network model, you define the transactions which can interact with assets. Business networks also include the participants who interact with them, each of which can be associated with a unique identity, across multiple business networks.

More information about  Hyperledger Composer framework can be found in the following link: https://hyperledger.github.io/composer/latest/

### Loopback Server

The LoopBack framework is a set of Node.js modules that you can use independently or together to quickly build REST APIs.
A LoopBack application interacts with data sources through the LoopBack model API, available locally within Node.js, remotely over REST, and via native client APIs for iOS, Android, and HTML5. Using these APIs, apps can query databases, store data, upload files, send emails, create push notifications, register users, and perform other actions provided by data sources and services.
Clients can call LoopBack APIs directly using Strong Remoting, a pluggable transport layer that enables you to provide backend APIs over REST, WebSockets, and other transports.

More information about Loopback server can be found in the following link: https://loopback.io/
