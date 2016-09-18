import { Injectable } from '@angular/core';
import * as Rx from "rxjs/Rx";
import { Configuration } from '../app.constants';
// import 'rxjs/add/operator/map';

@Injectable()
export class SocketService {
    private subject: Rx.Subject<MessageEvent>;

    constructor(private configuration: Configuration){};

    public connect(wsNamespace = ''): Rx.Subject<MessageEvent> {
        var url = this.configuration.wsUrl + wsNamespace;
        if(!this.subject) {
            this.subject = this.create(url);
        }
        return this.subject;
    }

    private create(url): Rx.Subject<MessageEvent> {
        let ws = new WebSocket(url);

        // bind ws events to observable (streams)
        let observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = obs.error.bind(obs);
            ws.onclose = obs.complete.bind(obs);

            return ws.close.bind(ws);
        }).share();

        // on obs next (send something in the stream) send it using ws.
        let observer = {
            next: (data: Object) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            },
        };

        return Rx.Subject.create(observer, observable);
    }
}
