### Performance
Performance is related to the design of the application, the CPU and RAM of the pc or server the application (peers and loopback server) is running on. In case we want to integrate our application so we can add participants or assets in bulk then we can refactor or create new transaction for this purpose. 
In our current design  we create only one Participant or one RegistryOfShareHolder in each transaction. For a production ready application,  where we have to add existing Registries of Shareholders and Chairmen of The Board of each company (i.e 300k business, 250 k chairmens of the board) we can create new transactions or refactor the current ones to create more than one Participant or Asset. In this way, in each transaction we can create a bulk of 
Chairmen of the Boards and Registries of ShareHolders faster than creating one Participant or Asset per transaction. 

### Peers
In a real scenario, we have to consider at least of one peer in each important stakeholder (Company, Business Registry). Current application is using only one validating peer. 
Adding new peers as validating peers this will also add latency in the transactions as there will be more peers involved in the consensus mechanism. For increasing the performance
of our system in this case we can:
1. Increase the CPU per Peer
2. Place your VM instances where your Peers run on closer geographical instances
3. Try to isolate the components of HLF as much as possible to eliminate shared resources (CPU, RAM)