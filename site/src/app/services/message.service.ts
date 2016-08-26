import {Injectable} from '@angular/core';
// import {Observable, Subject} from 'rxjs/Rx';
import * as Rx from "rxjs/Rx";
import {SocketService} from './socket.service';
import { Configuration } from '../app.constants';

export interface Message {
    id: string;
    data: any;
}

@Injectable()
export class MessageService {
    public messages: Rx.Subject<Message>;

    constructor(wsService: SocketService, private configuration: Configuration) {
      this.messages = <Rx.Subject<Message>>wsService
        .connect()
        .map((response: MessageEvent): Message => {
            let data = JSON.parse(response.data);
            return {
                id: data.id,
                data: data.data,
            }
        });
    }
}
