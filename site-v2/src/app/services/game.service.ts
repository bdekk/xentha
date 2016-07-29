import { Injectable } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { Game } from '../models/game';
import { Configuration } from '../app.constants';

@Injectable()
export class GameService {
  private url:string;
  private http:Http;
  private headers: Headers;
  private configuration: Configuration;

  constructor(http: Http, configuration: Configuration){
      this.http = http;
      this.configuration = configuration;
      this.url = configuration.apiUrl + configuration.gamesRoute;

      this.headers = new Headers();
      this.headers.append('Content-Type', 'application/json');
      this.headers.append('Accept', 'application/json');
  }

  public getAll(): Observable<Game[]> {
    return this.http.get(this.url)
    .map((response: Response) => <Game[]>response.json().games)
    .catch(this.handleError);
  }

  public getOne = (id: number): Observable<Game> => {
      return this.http.get(this.url + id)
          .map((response: Response) => <Game>response.json().game)
          .catch(this.handleError);
  }

  public create = (name: string): Observable<Game> => {
    let toCreate = JSON.stringify({ name: name });

    return this.http.post(this.url, toCreate, { headers: this.headers })
        .map((response: Response) => <Game>response.json().game)
        .catch(this.handleError);
  }

  public update = (id: number, gameToUpdate: Game): Observable<Game> => {
      return this.http.put(this.url + id, JSON.stringify(gameToUpdate), { headers: this.headers })
          .map((response: Response) => <Game>response.json().game)
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
