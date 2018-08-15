import {ModelManager} from 'composer-common';

export class ModelManagerWrapper {
  private static modelManagerInstance: ModelManager;

  public static async getInstance(modelData?: string, modelName?: string): Promise<ModelManager> {
    if (ModelManagerWrapper.modelManagerInstance) {
      return ModelManagerWrapper.modelManagerInstance;
    } else {
      ModelManagerWrapper.modelManagerInstance = new ModelManager();
      await ModelManagerWrapper.modelManagerInstance.addModelFile(modelData, modelName);

      return ModelManagerWrapper.modelManagerInstance;
    }
  }
}
