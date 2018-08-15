# Generic-Network on Blockchain

## Prerequisites
- Mac or Linux  
- Docker and docker-compose (https://www.docker.com/)  
- node 6.xx
- npm 5.xx (usually included in node package)

## Getting started  
This boilerplate aims to set up your blockchain environment as a dockerized application with only one command. After writting your cto, acl. js, 
qry files, you run the ```npm run start``` command in the root directory, fabric containers are deployed, composer cli is deploying the bna and creating the Reer Admin and Network admin cards. 
Then, composer rest server using the network admin card creates the APIs. In composer playground we can see the network admin card where we can connect and test our blockchain network.
Angular app is generated, from yo package using the current bna. If you are deploying your own bna, you have to recreate the angular app from the yo package 
(keep the Dockerfile and replace it with the newly created). To make it connect to the rest server in ```generic-app/src/app/data.service.ts``` change ```this.actionUrl = 'http://localhost:3000/api/';```

Navigate from the terminal to your project directory
```bash
/composer-fabric
```
Cleanup the running containers first:
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
