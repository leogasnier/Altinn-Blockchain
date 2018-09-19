# Shareholderbook on Blockchain

## Trying out the Hyperledger Shareholderbook PoC hosted in Azure
We have deployed the PoC to Azure. 
So if you prefer, you can first checkout the functionlity there.

The different components are reachable on this uri's:
Launch composer-rest-server explorer
http://23.102.36.231:3000/explorer/

Launch composer-playground
http://23.102.36.231:8090/

Launch loopback-server
http://23.102.36.231:8080/explorer/

Launch generic client
http://23.102.36.231:4200/

OR... maybe the most convinient way will be to use a client like Postman to access the BC PoC through the loopback server.
In the Postman folder of the repos you will find the necessary environment and collection files so that you can configure Postman to make requests against the blockchain.
In the documentation folder you will find the user journey file that indicates the preferred sequence of calls/requests to the blockchain.

## Getting the Hyperledger PoC up and running on your own
## Prerequisites
- Mac or Linux  
- Docker and docker-compose (https://www.docker.com/)  
- node 6.xx
- npm 5.xx (usually included in node package)

## Installation and test uri's 
Navigate from the terminal to your project directory. Get the baseimage and other images and install the node modules in local:
```bash
npm install
```
Cleanup the running containers and deleted files from previous run. 
```bash
./clean.sh
```
Start the blockchain network, client and deploy business network by running the init and start script. Wait till composer-cli container is done. 
```bash
npm run start
```
Launch composer-rest-server explorer
```
http://localhost:3000/explorer/
```
Launch composer-playground 
```
http://localhost:8090/
```
Launch loopback-server 
```
http://localhost:8080/
```
Launch generic client 
```
http://localhost:4200/
```
Stop the application
```bash
./clean.sh
```
