import {Model} from '@mean-expert/model';
import {Container} from 'typedi';
import {TokenUtility} from '../../domain/utils/user/TokenUtility';
import {LoggerFactory} from '../../domain/utils/logger/LoggerFactory';
import {LoggerInstance} from 'winston';

/**
 * @module Asset
 * @description
 * Write a useful Asset Model description.
 * Register hooks and remote methods within the
 * Model Decorator
 **/
@Model({
  hooks:   {
    beforeSave: {name: 'before save', type: 'operation'}
  },
  remotes: {
    myRemote: {
      accepts: {arg: 'options', type: 'any', optional: false},
      returns: {arg: 'result', type: 'array'},
      http:    {path: '/my-remote', verb: 'get'}
    }
  }
})
class Asset {
  private logger: LoggerInstance;
  private options: any;
  public constructor(public model: any) {
    this.logger  = Container.get(LoggerFactory).get('Asset');
    this.model.once('attached', () => {
      // this.overrideFindFunction();
      // this.overrideFindByIdFunction();
      // this.overrideCreateFunction();
      // this.overrideCountFunction();
    });
  }

  public beforeSave(ctx: any, next: Function): void {
    this.logger.info('Todo: Before Save');
    next();
  }

  public async myRemote(options: any, next: Function): Promise<string> {
    return 'Hello';
  }

  // private overrideFindFunction(): void {
  //   this.model.find = async (filter: any, options: any): Promise<any[]> => {
  //     // execute query on composer
  //   };
  // }

  // private overrideFindByIdFunction(): void {
  //   this.model.find = async (filter: any, options: any): Promise<any[]> => {
  //     // execute query on composer
  //   };
  // }

  private overrideCreateFunction(): void {
    this.model.create = async (data: any, options: any): Promise<any> => {
      // create asset on composer
    };
  }

  // private overrideCountFunction(): void {
  //   this.model.count = async (where: any, options: any): Promise<any> => {
  //     // execute query on composer
  //   };
  // }
}

module.exports = Asset;
