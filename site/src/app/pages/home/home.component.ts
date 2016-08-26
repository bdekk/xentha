import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router}    from '@angular/router';
import { MessageService } from '../../services/message.service';
import { SocketService } from '../../services/socket.service';
import { Configuration } from '../../app.constants';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  providers: [MessageService, SocketService, Configuration]
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private messageService: MessageService, private socketService: SocketService, private configuration: Configuration) {}

  ngOnInit() {
  }

  start() {

    this.messageService.messages.next({
      id: 'room.create',
      data: {'name': 'Blaat'}
    });

    this.messageService.messages.subscribe(msg => {
      console.log(msg);
        if(msg.id == 'room.created') {
            // navigate naar games!
        }
    });
  }

}
