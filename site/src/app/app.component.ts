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

  @ViewChild('xentha-snackbar') snackbar;
  @ViewChild('screen') screen;

  constructor(
      private authService: AuthService,
      private messageService: MessageService,
      private socketService: SocketService,
      private configuration: Configuration,
      private sharedService: SharedService) {
      // this.user = JSON.parse(localStorage.getItem('user'));
      // this.snackbar = document.querySelector('#xentha-snackbar');
      this.room = {};
  }

  ngOnInit(): void {
    this.messageService.messages$.subscribe(msg => {
      console.log(msg);
        if(msg.id == 'room.created') {
            // navigate naar games!
            this.room = msg.data;
            this.sharedService.setRoom(msg.data);

        }
    });
  }

  logout() {
    // this.user = undefined;
    // localStorage.removeItem('user');
    this.authService.logout();
    this.snackbar.MaterialSnackbar.showSnackbar('signed out..');
  }

  fullscreen() {
    this.screen.nativeElmeent.requestFullscreen();
  }

  ngAfterViewInit(){
      componentHandler.upgradeAllRegistered();
  }

}
