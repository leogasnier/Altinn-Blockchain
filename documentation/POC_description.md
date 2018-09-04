### Description
The purpose of this POC is to demonstrate how blockchain technology can be used to inform different parties about the transactions that take place in small companies that are not registered in the stock exchange. The information can be used to reassure transparency in the transactions and extract information that will reduce the current document administration to report all the company’s transactions to different authorities.
Furthermore, we want to investigate how the blockchain application can be integrated with the current altinn infrastructure to verify the different roles for users that login in the application.
   
### Previous Application
The architecture of students application is built using Hyperledger Fabric, Hyperledger Composer and Angular Client. Client is connected to the blockchain network using the composer rest server which doesn’t provide any authorization to the user calling the APIs. Furthermore, it doesn’t define the participant who is acting on blockchain as a result the permissions that are defined in the acl file are not used. In addition, there are functionalities in the smart contracts not fully implemented and it is necessary to refactor the code to meet the right coding standards and provide the right functionality in the user journey. There is also the need of dockerizing the application in order to deploy it without running all these different scripts that are currently in place for starting fabric, composer and client. 

### Steps to follow
1.	Dockerize the application to facilitate its deployment
2.	Refactor the code in the composer (smart contracts, data model, access control list, queries)
3.	Add loopback server to provide authorization to the users that are performing transactions in blockchain 
4.	Investigate how application can be integrated with the authorization service of Business Registry-Altinn


