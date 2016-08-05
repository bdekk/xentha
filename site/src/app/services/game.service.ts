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
  private imageHeaders: Headers;
  private configuration: Configuration;

  constructor(http: Http, configuration: Configuration){
      this.http = http;
      this.configuration = configuration;
      this.url = configuration.apiUrl + configuration.gamesRoute;

      this.headers = new Headers();
      this.headers.append('Content-Type', 'application/json');
      this.headers.append('Accept', 'application/json');

      this.imageHeaders = new Headers();
      this.imageHeaders.append('mimeType', 'multipart/form-data');
      this.imageHeaders.append('Content-Type', 'undefined');
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

  public create = (data: any): Observable<Game> => {
    let toCreate = JSON.stringify({"game": data});

    return this.http.post(this.url, toCreate, { headers: this.headers })
        .map((response: Response) => <Game>response.json().game)
        .catch(this.handleError);
  }

  public update = (id: number, gameToUpdate: Game): Observable<Game> => {
      return this.http.put(this.url + id, JSON.stringify({"game": gameToUpdate}), { headers: this.headers })
          .map((response: Response) => <Game>response.json().game)
          .catch(this.handleError);
  }

  public delete = (id: number): Observable<Response> => {
      return this.http.delete(this.url + id)
          .catch(this.handleError);
  }

  public addImage = (gameId, file): Promise<any> => {
    // return this.http.post(this.url + gameId + '/image', image, { headers: this.imageHeaders })
    //     .map((response: Response) => <string>response.json().image)
    //     .catch(this.handleError);

    return this.makeFileRequest(this.url + gameId + '/image', [], [file]);
  }

  public makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
      return new Promise((resolve, reject) => {
          var formData: any = new FormData();
          var xhr = new XMLHttpRequest();
          for(var i = 0; i < files.length; i++) {
              formData.append("uploads[]", files[i], files[i].name);
          }
          xhr.onreadystatechange = function () {
              if (xhr.readyState == 4) {
                  if (xhr.status == 200) {
                      resolve(JSON.parse(xhr.response));
                  } else {
                      reject(xhr.response);
                  }
              }
          }
          xhr.open("POST", url, true);
          xhr.send(formData);
      });
  }

  private handleError(error: Response) {
       console.error(error);
       return Observable.throw(error.json().error || 'Server error');
   }
}
