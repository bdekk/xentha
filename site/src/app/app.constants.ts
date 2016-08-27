import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public url: string = "http://localhost:3000";
    public api: string = "/api/";
    public apiUrl = this.url + this.api;
    public wsUrl: string = "ws://192.168.1.65:3000";

    public gamesRoute = "games/"
    public userRoute = "users/"
}
