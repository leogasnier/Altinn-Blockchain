### Current Authorization
In the application built for the current POC loopback server is performing the authentication of the user using the private db. In loopback server also, User is linked with a participant card and connects to the blockchain network having the permissions that have been defined in the Access Control List. The sequence diagram for logging in and performing a transaction is depicted in the Authorization_Logic_Current.png.

### Integration
In this POC we discussed and investigated how we can integrate the current application with the authorisation service provided currently by Altinn. A possible integration with the Altinn infrastructure is depicted in the diagram Authorization_Logic_Integration.png. Using the Single Sign On service that is currently implemented, we could verify the user on the Altinn side and give a token that he can connect to the Loopback APIs and identified as Participant. For this case all the users of the blockchain application should be added as participants from the deployment of the application. The description of OAuth 2.0 Authorization Framework can be found in the following link https://tools.ietf.org/html/rfc6749.

However, there are some points to consider and investigate from architectere aspect, how to integrate fully this application with Altinn infrastructure:
1. When a user that does not exist in blockchain, and is known in the Business Registry-Altinn wants  to perform a transaction in the blockchain, first needs to be created as participant, issued and identity and the act in blockchain. After the authentication from the Single Sign On service on Altinn side, there should be a service to call the Loopback Server API to create a new User implemented on Altinn. 
2.  There should be also a service  to update new information in blockchain related to the current participant and asset registries. For updating current participant and registries there should be considered update transactions in the current application and the Participant who is acting to update this information from the Altinn-Business Registry side. 


 




