import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public url: string = "http://localhost:3000";
    public api: string = "/api/";
    public apiUrl = this.url + this.api;

    public gamesRoute = "games/"
    public userRoute = "users/"
}
