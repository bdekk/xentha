import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router }    from '@angular/router';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  providers: []
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private messageService: MessageService) {}

  ngOnInit(): void {
    console.log(this.messageService !== undefined);
  }

  start(): void {

    this.messageService.send({
      id: 'room.create',
      data: {'name': 'Blaat'}
    });

    this.messageService.messages$.subscribe(msg => {
        if(msg.id == 'room.created') {
            this.messageService.send({
              id: 'room.join',
              data: {'roomCode': msg.data.roomCode, 'type': 'screen'}
            });

            // navigate naar games!
            this.router.navigate(['/games']);
        }
    });
  }

}
