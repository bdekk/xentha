import { NgModule, Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {User} from './models/user';

import {AuthService} from './services/auth.service';
import {MessageService} from './services/message.service';
import {SocketService} from './services/socket.service';
import {SharedService} from './services/shared.service';
import { Configuration } from './app.constants';

declare var componentHandler: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})

export class AppComponent {

  private user: User;
  title = "Xentha";

  private room: any;

  @ViewChild('toast') toast;
  @ViewChild('screen') screen;

  constructor(
      private authService: AuthService,
      private messageService: MessageService,
      private socketService: SocketService,
      private configuration: Configuration,
      private sharedService: SharedService) {
      this.room = {};
  }

  ngOnInit(): void {
    this.messageService.messages$.subscribe(msg => {
      console.log(msg);
        if(msg.id === 'room.created') {
            // navigate naar games!
            this.room = msg.data;
            this.sharedService.setRoom(msg.data);

        } else if(msg.id === 'room.player.joined') {
            this.room.players.push(msg.data);
            this.sharedService.setRoom(this.room);
        } else if(msg.id === 'room.player.left') {
            // let index = this.room.players.indexOf(msg.data);
            // if(index < 0) {
            //     let roomWithoutPlayer = this.room.players.splice(index, 1);
            //     this.sharedService.setRoom(roomWithoutPlayer);
            // }
        }
    });
  }

  logout() {
    // this.user = undefined;
    // localStorage.removeItem('user');
    this.authService.logout();
    this.toast.MaterialSnackbar.showSnackbar('signed out..');
  }

  fullscreen() {
    this.screen.nativeElement.requestFullscreen();
  }

  ngAfterViewInit(){
      componentHandler.upgradeAllRegistered();
  }

}
