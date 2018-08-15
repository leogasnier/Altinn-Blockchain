/* tslint:disable */
import {Injectable, Inject, Optional} from '@angular/core';
import {Http, Response} from '@angular/http';
import {SDKModels} from './SDKModels';
import {BaseLoopBackApi} from '../core/base.service';
import {LoopBackConfig} from '../../lb.config';
import {LoopBackAuth} from '../core/auth.service';
import {LoopBackFilter,} from '../../models/BaseModels';
import {JSONSearchParams} from '../core/search.params';
import {ErrorHandler} from '../core/error.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Rx';
import {Asset} from '../../models/Asset';


/**
 * Api services for the `Asset` model.
 */
@Injectable()
export class AssetApi extends BaseLoopBackApi {

  constructor(@Inject(Http) protected http: Http,
              @Inject(SDKModels) protected models: SDKModels,
              @Inject(LoopBackAuth) protected auth: LoopBackAuth,
              @Inject(JSONSearchParams) protected searchParams: JSONSearchParams,
              @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler) {
    super(http, models, auth, searchParams, errorHandler);
  }

  /**
   * <em>
   * (The remote method definition does not provide any description.)
   * </em>
   *
   * @param {any} options 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{any}` - 
   */
  public myRemote(options: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string   = "GET";
    let _url: string      = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
      "/Assets/my-remote";
    let _routeParams: any = {};
    let _postBody: any    = {};
    let _urlParams: any   = {};
    if (typeof options !== 'undefined' && options !== null) _urlParams.options = options;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `Asset`.
   */
  public getModelName() {
    return "Asset";
  }
}
