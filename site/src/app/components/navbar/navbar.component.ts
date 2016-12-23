import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css']
})
export class Navbar implements OnInit {
    @Input() room:any;
    @Output() fullscreen = new EventEmitter();

    private data: Date;
    private format: String;
    private intervalSet = false;

    constructor(private messageService: MessageService) { }

    ngOnInit() {
        this.format = "h:mm"

        this.data = this.data || new Date();
        let miliseconds = (60 - this.data.getSeconds()) * 1000;
        window.setTimeout(()=>{this.refreshTime();}, miliseconds);

        this.messageService.messages$.subscribe(msg => {
          console.log(msg);
            if(msg.id == 'room.fullscreen') {
                // navigate naar games!
                this.toggleFullscreen();
            }
        });

    }

    refreshTime() {
        this.data = new Date();
        if(!this.intervalSet) {
            window.setInterval(()=>{this.refreshTime()}, 60000);
            this.intervalSet = true;
        }
    }

    toggleFullscreen() {
        this.fullscreen.emit({fullscreen: true});
    }

}
