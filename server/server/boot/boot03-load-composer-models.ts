import {BootScriptAsync} from '@mean-expert/boot-script';
import {LoggerInstance} from 'winston';
import {Container} from 'typedi';
import {LoggerFactory} from '../../domain/utils/logger';
import {ModelManagerWrapper} from '../../domain/composer/models/ModelManagerWrapper';
import * as path from 'path';
import {Config} from '../../domain/config';

@BootScriptAsync()
class Boot03LoadComposerModels {
  private logger: LoggerInstance;
  private modelFilePath: string = Config.settings.composer.defaultModelFilePath;
  private modelFileName: string = Config.settings.composer.defaultModelFileName;

  public constructor(private app: any, next: Function) {
    const fs    = require('fs');
    this.logger = Container.get(LoggerFactory).get('Boot03:LoadComposerModels');

    ModelManagerWrapper.getInstance(fs.readFileSync(path.join(this.modelFilePath, this.modelFileName)).toString(), this.modelFileName).then(
      () => {
        next();
      }
    );
  }
}

export = Boot03LoadComposerModels;
