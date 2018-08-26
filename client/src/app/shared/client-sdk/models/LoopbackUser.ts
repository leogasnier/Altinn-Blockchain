/* tslint:disable */

declare var Object: any;
export interface LoopbackUserInterface {
  "ID"?: string;
  "firstName": string;
  "lastName": string;
  "companyId"?: string;
  "phone"?: string;
  "participantClass"?: string;
  "roles"?: Array<any>;
  "active"?: boolean;
  "realm"?: string;
  "username"?: string;
  "email": string;
  "emailVerified"?: boolean;
  "_rev"?: string;
  "password"?: string;
  composerParticipant?: any;
  accessTokens?: any[];
  roleMappings?: any[];
}

export class LoopbackUser implements LoopbackUserInterface {
  "ID": string;
  "firstName": string;
  "lastName": string;
  "companyId": string;
  "phone": string;
  "participantClass": string;
  "roles": Array<any>;
  "active": boolean;
  "realm": string;
  "username": string;
  "email": string;
  "emailVerified": boolean;
  "_rev": string;
  "password": string;
  composerParticipant: any;
  accessTokens: any[];
  roleMappings: any[];
  constructor(data?: LoopbackUserInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `LoopbackUser`.
   */
  public static getModelName() {
    return "LoopbackUser";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of LoopbackUser for dynamic purposes.
  **/
  public static factory(data: LoopbackUserInterface): LoopbackUser{
    return new LoopbackUser(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'LoopbackUser',
      plural: 'LoopbackUsers',
      path: 'LoopbackUsers',
      idName: 'ID',
      properties: {
        "ID": {
          name: 'ID',
          type: 'string'
        },
        "firstName": {
          name: 'firstName',
          type: 'string'
        },
        "lastName": {
          name: 'lastName',
          type: 'string'
        },
        "companyId": {
          name: 'companyId',
          type: 'string'
        },
        "phone": {
          name: 'phone',
          type: 'string'
        },
        "participantClass": {
          name: 'participantClass',
          type: 'string'
        },
        "roles": {
          name: 'roles',
          type: 'Array&lt;any&gt;'
        },
        "active": {
          name: 'active',
          type: 'boolean'
        },
        "realm": {
          name: 'realm',
          type: 'string'
        },
        "username": {
          name: 'username',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "emailVerified": {
          name: 'emailVerified',
          type: 'boolean'
        },
        "_rev": {
          name: '_rev',
          type: 'string'
        },
        "password": {
          name: 'password',
          type: 'string'
        },
      },
      relations: {
        composerParticipant: {
          name: 'composerParticipant',
          type: 'any',
          model: '',
          relationType: 'hasOne',
                  keyFrom: 'ID',
          keyTo: 'ID'
        },
        accessTokens: {
          name: 'accessTokens',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'ID',
          keyTo: 'userId'
        },
        roleMappings: {
          name: 'roleMappings',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'ID',
          keyTo: 'principalId'
        },
      }
    }
  }
}
