import {Config} from '../../config/index';
import {ComposerConceptType} from '../types/ComposerConceptType';
import {Concept, Factory, Relationship} from 'composer-common';
import {ModelManagerWrapper} from '../models/ModelManagerWrapper';
import {AssetType} from '../types/AssetType';

export abstract class TransactionBuilder {
  protected composerNameSpace: string;
  protected channelName: string;
  private factory: Factory;

  public constructor() {
    this.composerNameSpace = Config.settings.composer.namespace;
    this.channelName       = Config.settings.composer.channel;
  }

  public abstract create(data: any): any;

  public newConcept(conceptName: ComposerConceptType): Concept {
    return this.factory.newConcept(this.composerNameSpace, conceptName);
  }

  public newRelationship(assetType: AssetType, id: string): Relationship {
    return this.factory.newRelationship(this.composerNameSpace, assetType, id);
  }

  protected async getFactory(): Promise<Factory> {
    if (this.factory) {
      return this.factory;
    }
    this.factory = await new Factory(await ModelManagerWrapper.getInstance());

    return this.factory;
  }
}
