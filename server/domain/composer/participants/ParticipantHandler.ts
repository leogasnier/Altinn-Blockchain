import {LoggerInstance} from 'winston';
import {Factory, IdCard} from 'composer-common';
import * as ComposerCommon from 'composer-common';
import * as ComposerClient from 'composer-client';
import {Config} from '../../config';
import {ParticipantType} from '../types/ParticipantType';
import {ParticipantTransactionMap} from './ParticipantTransactionMap';
import {TransactionHandler} from '../transactionHandler/TransactionHandler';
import {BusinessNetworkHandler} from '../composerConnections/BusinessNetworkHandler';
import {Container} from 'typedi';
import {LoggerFactory} from '../../utils/logger/LoggerFactory';
import * as fs from 'fs';
import * as path from 'path';
import {ModelManagerWrapper} from '../models/ModelManagerWrapper';
import {Identity} from '../identity/Identity';

export class ParticipantHandler {
  private channel: string                      = Config.settings.composer.channelName;
  private networkName: any                     = Config.settings.composer.network;
  private composerNameSpace: string            = Config.settings.composer.namespace;
  private composerCardsDirectory: string       = Config.settings.composer.composerDefaultCardsDirectory;
  private businessNetworkAdminCardName: string = Config.settings.composer.networkAdminName + '@' + this.channel;
  private businessNetworkHandler: BusinessNetworkHandler;
  private transactionHandler: TransactionHandler;
  private logger: LoggerInstance;

  public constructor() {
    this.logger                 = Container.get(LoggerFactory).get('ParticipantHandler');
    this.businessNetworkHandler = new BusinessNetworkHandler();
    this.transactionHandler     = new TransactionHandler(this.businessNetworkHandler);
  }

  public async createNewParticipant(participantData: any, participantType: ParticipantType): Promise<IdCard> {
    try {
      await this.registerParticipantOnChannel(participantData, participantType, this.channel);
    } catch (error) {
      return Promise.reject(error);
    }

    return await this.businessNetworkHandler.getBusinessNetworkAdminConnection().hasCard(participantData.ID + '@' + this.channel);
  }

  public async createNetworkAdminCardFolderFromArchive(): Promise<void> {
    const networkAdminCard: IdCard = await this.getCardFromFile(this.businessNetworkAdminCardName);
    await this.addCardToCardStore(this.businessNetworkAdminCardName, networkAdminCard);
  }

  private async registerParticipantOnChannel(participantData: any, participantType: ParticipantType, channelName: string): Promise<void> {
    try {
      await this.businessNetworkHandler.createBusinessNetworkAdminConnection();
      await this.businessNetworkHandler.connectAsBusinessNetworkAdmin();

      const participant = await this.createParticipant(
        participantData,
        participantType
      );

      await this.issueIdentity(
        participant,
        participantData.ID,
        channelName,
        this.businessNetworkHandler.getBusinessNetworkConnection()
      );
    } catch (error) {
      this.logger.error('An error occurred when registering participant on channel', error);

      return Promise.reject(error);
    }
  }

  private async createParticipant(data: any, participantType: ParticipantType): Promise<ComposerCommon.Relationship> {
    try {
      await this.transactionHandler.invoke(
        this.businessNetworkAdminCardName,
        ParticipantTransactionMap.getCreateTransaction(participantType),
        data
      );
    } catch (error) {
      if (error.toString().indexOf('already exists') !== -1) {
        this.logger.error('Not creating participant ' + data.userID + ' as it already exists');
      } else {
        throw error;
      }
    }

    return await this.getParticipantRelationship(participantType, data.userID);
  }

  public async getParticipantRelationship(participantType: ParticipantType, participantID: string): Promise<ComposerCommon.Relationship> {
    const factory: Factory = await new Factory(await ModelManagerWrapper.getInstance());

    return await factory.newRelationship(this.composerNameSpace, participantType, participantID);
  }

  private async issueIdentity(participant: any, participantID: string, channelName: string, businessNetworkConnection: ComposerClient.BusinessNetworkConnection): Promise<void> {
    try {
      const cardName: string   = `${participantID}@${channelName}`;
      const identity: Identity = await businessNetworkConnection.issueIdentity(participant, participantID);

      const card: IdCard = await this.createCardFromIdentity(participantID, identity.userSecret, channelName);

      await this.addCardToCardStore(cardName, card);
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async createCardFromIdentity(participantID: string, enrollmentSecret: string, channelName: string): Promise<ComposerCommon.IdCard> {
    const metadata: any          = {
      userName:         participantID,
      enrollmentSecret: enrollmentSecret,
      businessNetwork:  this.networkName
    };
    const connectionProfile: any = await this.businessNetworkHandler.getDefaultConnectionProfile();

    return await new ComposerCommon.IdCard(metadata, connectionProfile);
  }

  private async getCardFromFile(cardName: string): Promise<ComposerCommon.IdCard> {
    try {
      const archive = await fs.readFileSync(path.join(this.composerCardsDirectory, cardName + '.card'));

      return await ComposerCommon.IdCard.fromArchive(archive);
    } catch (error) {
      this.logger.error(error);

      return Promise.reject(error);
    }
  }

  private async addCardToCardStore(cardName: string, card: ComposerCommon.IdCard): Promise<void> {
    try {
      await this.businessNetworkHandler.getBusinessNetworkAdminConnection().importCard(cardName, card);
    } catch (error) {
      this.logger.error('Error when adding card ' + cardName + ' to cardstore', error);
    }
  }
}
