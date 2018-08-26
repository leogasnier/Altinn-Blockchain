/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { LoopbackUser } from '../../models/LoopbackUser';
import { AltinnParticipant } from '../../models/AltinnParticipant';
import { RegistryOfShareHolders } from '../../models/RegistryOfShareHolders';
import { Stock } from '../../models/Stock';
import { Asset } from '../../models/Asset';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    LoopbackUser: LoopbackUser,
    AltinnParticipant: AltinnParticipant,
    RegistryOfShareHolders: RegistryOfShareHolders,
    Stock: Stock,
    Asset: Asset,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
