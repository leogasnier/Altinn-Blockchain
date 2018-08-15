# Generic-Network on Blockchain

## Prerequisites
- Mac or Linux  
- Docker and docker-compose (https://www.docker.com/)  
- node 6.xx
- npm 5.xx (usually included in node package)

## Getting started  
Get the baseimage and other images and install the node modules in local:
```bash
npm install
```
Navigate from the terminal to your project directory. Cleanup the running containers first.
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
