import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx'

@Injectable()
export class ProfileService {
  private endpoint_url:string = "https://localhost:4000/api/users/";
  private http:Http;
  constructor(http: Http){
      this.http = http;
  }

  public getAllProfiles() {
    return this.http.get(this.endpoint_url).map(res => res.json());
  }


  public getProfilesByName(name: string) {
    return this.http.get(this.endpoint_url + '?name=' + name).map(res => res.json());
  }
}
