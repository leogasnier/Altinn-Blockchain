import * as ComposerClient from 'composer-client';
import * as ComposerCommon from 'composer-common';
import {Config} from '../../config/index';
import {Factory, IdCard, Query} from 'composer-common';
import * as ComposerAdmin from 'composer-admin';
import {LoggerFactory} from '../../utils/logger/LoggerFactory';
import {Container} from 'typedi';
import {LoggerInstance} from 'winston';
import {AdminConnection} from 'composer-admin';
import {AssetRegistry} from 'composer-client';

export class BusinessNetworkHandler {
  private logger: LoggerInstance;
  private businessNetworkConnection: ComposerClient.BusinessNetworkConnection;
  private businessNetworkAdminConnection: ComposerAdmin.AdminConnection;
  private businessNetworkDefinition: ComposerCommon.BusinessNetworkDefinition;
  private networkAdminConnectionProfile: AdminConnection;
  private networkAdminName: string;
  private networkName?: string;
  private networkAdminCardName: string;
  private channelName: string;

  public constructor() {
    this.logger                         = Container.get(LoggerFactory).get('BusinessNetworkHandler');
    this.businessNetworkConnection      = new ComposerClient.BusinessNetworkConnection(Config.settings.composer.connectionOptions);
    this.businessNetworkAdminConnection = new ComposerAdmin.AdminConnection(Config.settings.composer.connectionOptions);
    this.networkName                    = Config.settings.composer.network;
    this.channelName                    = Config.settings.composer.channelName;
    this.networkAdminName               = Config.settings.composer.networkAdminName;
    this.networkAdminCardName           = this.networkAdminName + '@' + this.channelName;
  }

  public async connect(cardName: string): Promise<void> {
    try {
      this.businessNetworkDefinition = await this.businessNetworkConnection.connect(cardName);
    } catch (error) {
      this.logger.error('Failed to connect. Error: ', error);
    }
  }

  public async connectAsBusinessNetworkAdmin(): Promise<void> {
    try {
      await this.businessNetworkAdminConnection.connect(this.networkAdminCardName);
      this.businessNetworkDefinition = await this.businessNetworkConnection.connect(this.networkAdminCardName);
    } catch (error) {
      this.logger.error('Failed to connect as Network Admin: Error: ', error);
    }
  }

  public disconnect(): Promise<any> {
    return this.businessNetworkConnection.disconnect();
  }

  public disconnectBusinessNetworkAdmin(): Promise<any> {
    return this.businessNetworkAdminConnection.disconnect();
  }

  public async createBusinessNetworkAdminConnection(): Promise<void> {
    const networkAdminCardName = this.networkAdminName + '@' + this.channelName;
    const adminCard: IdCard    = await this.businessNetworkAdminConnection.exportCard(networkAdminCardName);

    this.networkAdminConnectionProfile = await adminCard.getConnectionProfile();

    try {
      await this.businessNetworkAdminConnection.importCard(networkAdminCardName, adminCard);
    } catch (error) {
      this.logger.error('Card already exists. Importing and connecting.', error);
    }
  }

  public async submitTransaction(transaction: any): Promise<any> {
    return await this.businessNetworkConnection.submitTransaction(transaction);
  }

  public async getFactory(): Promise<Factory> {
    return await this.businessNetworkConnection.getBusinessNetwork().getFactory();
  }

  public getNetworkAdminCardName(): string {
    return this.networkAdminCardName;
  }

  public async getDefaultConnectionProfile(): Promise<AdminConnection> {
    const defaultAdminCard: IdCard = await this.businessNetworkAdminConnection.exportCard(this.networkAdminCardName);

    return await defaultAdminCard.getConnectionProfile();
  }

  public getSerializer(rawResource: any): any {
    return this.businessNetworkDefinition.getSerializer().toJSON(rawResource);
  }

  public getAssetRegistry(assetRegistry: string): Promise<AssetRegistry> {
    return this.businessNetworkConnection.getAssetRegistry(assetRegistry);
  }

  public getBusinessNetworkConnection(): ComposerClient.BusinessNetworkConnection {
    return this.businessNetworkConnection;
  }

  public getBusinessNetworkAdminConnection(): ComposerAdmin.AdminConnection {
    return this.businessNetworkAdminConnection;
  }

  public query(queryName: string, parameters?: any): Promise<any> {
    return this.businessNetworkConnection.query(queryName, parameters);
  }
}
