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
Cleanup the running containers first:
```bash
docker rm -f `docker ps -aq`
```
**Tip:** You can add something like a `cleanDocker` alias to use anytime for cleaning up your env.
```bash
echo "alias cleanDocker='docker rm -f -v $(docker ps -aq) 2>/dev/null; docker rmi $(docker images -qf "dangling=true") 2>/dev/null; docker rmi $(docker images | grep "dev-" | awk "{print $1}") 2>/dev/null; docker rmi $(docker images | grep "^<none>" | awk "{print $3}") 2>/dev/null;'" >> ~/.bash_profile
source ~/.bash_profile
```
Restart your terminal and then try to run: `cleanDocker`.

Build the blockchain network. It will build the server, composer, client and installs all npm packages on the containers
```bash
docker-compose build
```

Start the blockchain network, composer and deploy business network by running the init and start script: 
```bash
npm run start
```

This command runs the initAndStart.sh script which runs docker-compose.yml (equal to: ```docker compose up```) and creates a database called ```loopback-db```.
It starts the loopback server, creates a client and sets up composer. 
It runs the ```deploy.sh``` script, which creates a PeerAdmin card, generates a Business Network Archive, installs composer runtime and eventually instantiates the composer network.

**Remember you can kill containers singularly and restart them in case you need. You should not clean up and restart all the environment every time if not needed** (that will save you a lot of time).

# Deployment of Boilerplate on IBP and Node Server on IBM Cloud with Cloud Foundry.

## Prerequisites
- Ubuntu Linux 14.04 / 16.04 LTS (both 64-bit), or Mac OS 10.12
- Node v8.9 or higher (v9 is not supported)
- git v2.9.x or higher
- Python v2.7.x
- IBM Blockchain Platform Starter Plan

## Development Guide

Before we deploy our business network on the IBM Blockchain Platform, we have to make sure that it is working as intended. For this, we can use the local environment and run the BNA by following the guide in Getting Started.

## Installation Guide

To be able to deploy the BNA file to IBM Blockchain Platform, we have to install some command line tools. The first one is composer-cli which can be installed through this command
```bash
 npm install -g composer-cli@0.19.x
```
To be able to deploy your Node Server to IBM Cloud Platform, you have to install the IBM Cloud CLI which includes Cloud Foundry command line tools in it.
```bash
curl -sL https://ibm.biz/idt-installer | bash
```
For the next steps, we assume that you have successfully started a IBM Blockchain Platform Starter Plan instance, where we have 2 organizations with 1 peer each and a default channel called **defaultchannel**.

**Tip:** We would advise to create a new folder and put all the required certificates and BNA in the same folder for ease of pathing in the commands. 

1. From the Starter Plan overview screen, click **Connection Profile** and then download. Rename this file to 'connection-profile.json'.

2. Move this file to be in the same directory as your *\.bna* file.

3. Inside the connection profile, go all the way down until you see 'registrar'. Inside 'registrar', under 'enrollId' there is an **enrollSecret** property. Retrieve the secret and save a copy of it.

4. Using the **enrollSecret** noted from step one, run the following command to create the CA business network card:
```bash
 composer card create -f ca.card -p connection-profile.json -u admin -s enrollSecret
```
5. Import the card using the following command:
```
   composer card import -f ca.card -c ca
```

6. Now that the card is imported, it can be used to exchange the **enrollSecret** for valid certificates from the CA. Run the following command to request certificates from the certificate authority:

```
   composer identity request --card ca --path ./credentials -u admin -s enrollSecret
```

Replace `enrollSecret` in the preceding command with the admin secret retrieved from the connection profile. The `composer identity request` command creates a `credentials` directory that contains certificate `.pem` files.

7. In the Starter Plan UI, click on the **Members** tab, then **Certificates**, then **Add Certificate**. Go to your `credentials` directory, and copy and paste the contents of the `admin-pub.pem` file in the certificate box. Submit the certificate and restart the peers. Note: restarting the peers takes a minute.

8. Next, the certificates must be synced on the channel. Click the **Channels** tab, then the **Actions** button, then **Sync Certificate** and **Submit**.

9. Create an admin card with the channel admin and peer admin roles by using the following command:

```
   composer card create -f adminCard.card -p connection-profile.json -u admin -c ./credentials/admin-pub.pem -k ./credentials/admin-priv.pem --role PeerAdmin --role ChannelAdmin
```
10. Import the card created in the previous step using the following command:

```
   composer card import -f adminCard.card -c adminCard
```
11. Install the Hyperledger Composer runtime with the following command:

```
   composer network install -c adminCard -a generic-network.bna
```
   **Tip** Note the business network version number which is returned when you run this command. It will be required in the next step.

12. Start the business network with the command below. If you get an error, wait a minute and try again. Use the version number from the last step after the `-V` option.

```
    composer network start -c adminCard -n generic-network -V 0.19.4 -A admin -C ./credentials/admin-pub.pem -f delete_me.card
```
13. Delete the business network card called `delete_me.card`.

14. Create a new business network card and reference the certificates that are retrieved earlier with the following command:

```
   composer card create -n generic-network -p connection-profile.json -u admin -c ./credentials/admin-pub.pem -k ./credentials/admin-priv.pem
```
15. Import the business network card with the following command:

```
    composer card import -f ./admin@generic-network.card
```

16.  Run the following command to ping the business network:

```
   composer network ping -c admin@generic-network
```
To view the chaincode logs, click **Channels**, and then select your channel. Click the dropdown arrow to view the logs, or the **Actions** symbol to view in more detail.


If we get the correct response, we are ensured that the BNA is correctly installed and is running.
The next step in our deployment is importing the admin business network card into our Node server.

## Composer and Node Server Interaction

For the `ModelManagerWrapper` to be aware of our Business Network internal structures, we have to copy the `.cto` file that is residing in the `/composer/bna/models` part of our project to 
`/server/resources/composerModels`. 

To be able to interact with the deployed BNA file, we require the `admin business network card` that we generated in the prior steps. 

1. Go to the folder where the `admin@generic-network.card` is residing. 

2. Copy `admin@generic-network.card` to the project in the path `/server/resources/connectionProfiles/cards`

3. In `/server/domain/config` add a new configuration with respect to the `settings.interface.ts` which reflects the the configuration of your deployment environment.

    **Tip:** IBM Cloud Platform Node instances require the port to be 8080 by default.

    **Note:** For Boilerplate project, we have already provided the configuration for you named `starterPlan.config.ts`.

4. In the same directory, modify `index.ts` according to the name that you want to define your deployment environment. E.g:
    ```
        case 'starterPlan':
        envSettings = StarterPlanConfig.settings;
        break;
    ```
    **Note** This step is already handled for the Boilerplate project.

5. Login to your IBM Cloud account using the following command, notice the required organization name and space name that needs to be also passed. These can be found in your Node instance dashboard:
    ```
    bluemix login -u username@ibm.com -o org_name -s space_name
    ```
6. Set your API end-point which can be found in the `Getting Started` part of the Node instance dashboard. E.g
    ```
    bluemix api https://api.eu-gb.bluemix.net
    ```
7. To be able to set the right config for your project in the cloud environment use the following command:
    ```
    bluemix cf set-env {name-of-your-instance} NODE_ENV starterplan
    ```
8. Go to the directory `/server` of the project in your terminal and run the following command to push your server to the Node instance in IBM Cloud.
    ```
    bluemix app push ${name-of-your-instance}
    ```
    **Note** This step might take a while. 
9. When the deployment process is over you can access to the API endpoints through https://${name-of-your-instance}.eu-gb.bluemix.net/explorer

10. You can check the logs of your server by running the following command:
    ```
    bluemix cf logs ${name-of-your-instance} --recent 
    ```
