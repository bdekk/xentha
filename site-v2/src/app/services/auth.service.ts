import { Injectable } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { Configuration } from '../app.constants';

@Injectable()
export class AuthService {
  private url:string;
  private http:Http;
  private headers: Headers;
  private configuration: Configuration;

  constructor(http: Http, configuration: Configuration){
      this.http = http;
      this.configuration = configuration;
      this.url = configuration.apiUrl + configuration.userRoute;

      this.headers = new Headers();
      this.headers.append('Content-Type', 'application/json');
      this.headers.append('Accept', 'application/json');
  }

  public getAll(): Observable<User[]> {
    return this.http.get(this.url)
    .map((response: Response) => <User[]>response.json().users)
    .catch(this.handleError);
  }

  public getOne = (id: number): Observable<User> => {
      return this.http.get(this.url + id)
          .map((response: Response) => <User>response.json().user)
          .catch(this.handleError);
  }

  public create = (data: any): Observable<User> => {
    let toCreate = JSON.stringify({user: data});

    return this.http.post(this.url, toCreate, { headers: this.headers })
        .map((response: Response) => <User>response.json().game)
        .catch(this.handleError);
  }

  public login = (data: any): Observable<User> => {
    let loginData = JSON.stringify({user: data});

    return this.http.post(this.url + 'login', loginData, { headers: this.headers })
        .map((response: Response) => <User>response.json().user)
        .catch(this.handleError);
  }

  public update = (id: number, userToUpdate: User): Observable<User> => {
      return this.http.put(this.url + id, JSON.stringify(userToUpdate), { headers: this.headers })
          .map((response: Response) => <User>response.json().user)
          .catch(this.handleError);
  }

  public delete = (id: number): Observable<Response> => {
      return this.http.delete(this.url + id)
          .catch(this.handleError);
  }

  private handleError(error: Response) {
       console.error(error);
       return Observable.throw(error.json().error || 'Server error');
   }
}
