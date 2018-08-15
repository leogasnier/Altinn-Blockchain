import {throwError as observableThrowError, Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Configuration} from '../app.constants';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

@Injectable()
export class AuthenticationService {
  public actionUrl: string;
  public token: string;
  private TOKEN_KEY: string;
  private USER_KEY: string;
  public user: string;

  public constructor(private _http: HttpClient,
                     private _configuration: Configuration) {
    this.actionUrl = `${_configuration.apiHost}${_configuration.apiPrefix}login`;
    this.token     = this.getToken();
    this.TOKEN_KEY = 'token';
    this.USER_KEY  = 'currentUser';
  }

  public login(username: string, password: string): Observable<any> {
    return this._http.post(this.actionUrl, {username: username, password: password}).pipe(
      map((response: HttpResponse<any>) => {
        if (!response || !response.body || !response.body) {
          return false;
        }

        const user: string  = response.body.user;
        const token: string = response.body.token;
        if (!token) {
          return false; // Login unsuccessful if there's no token in the response
        }
        this.token = token;

        // store username and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem(this.TOKEN_KEY, JSON.stringify({token}));
        localStorage.setItem(this.USER_KEY, JSON.stringify({user}));

        return true;
      }), catchError((error: any) => observableThrowError(error.json().error || 'Server error')), );
  }

  // clear token and remove user from local storage to log user out
  public logout(): void {
    this.token = null;
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  public createAuthorizationHeader(): HttpHeaders {
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('x-access-token', this.getToken());
    headers.append('Content-Type', 'application/json');

    return headers;
  }

  private getToken(): string {
    const userToken = JSON.parse(localStorage.getItem(this.TOKEN_KEY));

    return userToken ? userToken.token : null;
  }

  public isAuthenticated(): boolean {
    return this.getToken() != null;
  }
}
