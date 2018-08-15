#!/bin/sh -e

Green='\33[0;32m'
Blue='\33[1;36m'
NC='\033[0m'

createPeerAdminCard() {
mkdir -p $HOME/resources/cards
  composer card create \
    -f $HOME/resources/cards/${PEER_ADMIN_NAME}@$CHANNEL.card \
    -p $HOME/.composer-connection-profiles/connection.json \
    -u $PEER_ADMIN_NAME \
    -c $HOME/.admin-crypto/msp/signcerts/Admin@org1.example.com-cert.pem \
    -k $HOME/.admin-crypto/msp/keystore/114aab0e76bf0c78308f89efc4b8c9423e31568da0c340ca187a9b17aa9a4457_sk \
    -r PeerAdmin \
    -r ChannelAdmin

  composer card import -f $HOME/resources/cards/${PEER_ADMIN_NAME}@$CHANNEL.card

  printf "${Green}Peer admin card CREATED and IMPORTED ${NC} \n"
}

build() {
  mkdir -p $HOME/bna/dist
  composer archive create --sourceType dir --sourceName $HOME/bna -a "$HOME/bna/dist/${COMPOSER_BUSINESS_NETWORK}.bna"

  printf "${Green}Created BNA in dist folder${NC}\n"
}

installComposerRuntime() {
  composer network install \
  -a "$HOME/bna/dist/${COMPOSER_BUSINESS_NETWORK}.bna" \
  -c ${PEER_ADMIN_NAME}@$CHANNEL

  printf "${Green}Installation of Composer Runtime was successful${NC}\n"
}

instantiateComposerRuntime() {
  printf "${Blue}Installing bna on hlfv1 started peer-admin-name=${PEER_ADMIN_NAME}, composer-network=${COMPOSER_BUSINESS_NETWORK}${NC}\n"

  composer network start \
    -n ${NETWORK_NAME} \
    -V ${COMPOSER_VERSION} \
    -A ${COMPOSER_ENROLLMENT_ID} \
    -S ${COMPOSER_ENROLLMENT_SECRET} \
    -c ${PEER_ADMIN_NAME}@$CHANNEL \
    -f $HOME/resources/cards/networkadmin@$CHANNEL.card

  printf "${Green}Network admin card created ${NC}\n"

  composer card import --file $HOME/resources/cards/networkadmin@$CHANNEL.card

  printf "${Green}Pinging network admin card ${NC}\n"
  composer network ping -c admin@altinn-network

  composer card export --file $HOME/resources/cards/networkadmin@$CHANNEL.card --card admin@altinn-network

  printf "${Green}Installation of BNA completed\n${NC}"
}

if [ "$#" -eq 0 ]; then
  ACTION="run:createPeerAdminCard"
else
  ACTION=$1
fi

if [ "${ACTION}" = "run:createPeerAdminCard" ]; then
  sleep 10

  printf "${Blue}Cleaning server and composer card folder${NC}\n"
  rm -rf $HOME/resources/cards/*
  rm -rf $HOMESERVER/resources/cards/*
  printf "Cleaned!\n"

  printf "${Blue}Creating Peer Admin Card${NC}\n"
  createPeerAdminCard

  printf "${Blue}Generating Business Network Archive${NC}\n"
  build

  printf "${Blue}Installing Composer Runtime${NC}\n"
  installComposerRuntime

  printf "${Blue}Instantiating Composer Network${NC}\n"
  instantiateComposerRuntime

  printf "${Blue}Pinging composer Network${NC}\n"
  composer network ping -c admin@${COMPOSER_BUSINESS_NETWORK}

elif [ "${ACTION}" = "help" ]; then
  print_usage

  exit 0
else
  print_usage

  exit 1
fi

printf "${Green}Done!${NC}\n"
