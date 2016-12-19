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
    private _messages: Rx.Subject<Message>;
    messages$: Rx.Observable<Message>;

    constructor(wsService: SocketService, private configuration: Configuration) {
      console.log('messag eservice');
      this._messages = <Rx.Subject<Message>>wsService
        .connect()
        .map((response: MessageEvent): Message => {
            let data = JSON.parse(response.data);
            return {
                id: data.id,
                data: data.data,
            }
        });

      this.messages$ = this._messages.asObservable();
    }

    public send(message: Message): void {
      this._messages.next(message);
    }

    public unsubscribe(): void {
      this._messages.unsubscribe();
    }
}
