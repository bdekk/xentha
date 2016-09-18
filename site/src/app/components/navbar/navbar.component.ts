import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from '../../services/message.service';

@Component({
  moduleId: module.id,
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css']
})
export class Navbar implements OnInit {
    @Input() room:any;

    constructor(private messageService: MessageService) { }

    ngOnInit() {

        // this.messageService.messages$.subscribe(msg => {
        //   console.log(msg);
        //     if(msg.id == 'room.created') {
        //         // navigate naar games!
        //         this.room = msg.room;
        //     }
        // });
    }

}
