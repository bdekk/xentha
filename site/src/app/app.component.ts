import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import {User} from './models/user';
import {AuthService} from './services/auth.service';
import {MessageService} from './services/message.service';
import {SocketService} from './services/socket.service';
import { Configuration } from './app.constants';
import { Drawer } from './components/drawer';

declare var componentHandler: any;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES, Drawer],
  providers: [AuthService, MessageService, Configuration, SocketService]

})

export class AppComponent {

  private user: User;
  title = "bla";

  private room: any;

  @ViewChild('xentha-snackbar') snackbar;
  @ViewChild('screen') screen;

  constructor(private authService: AuthService, private messageService: MessageService) {
      // this.user = JSON.parse(localStorage.getItem('user'));
      // this.snackbar = document.querySelector('#xentha-snackbar');
      this.room = {};

      this.messageService.messages.subscribe(msg => {
          if(msg.id == 'room.created') {
              this.room = msg.data;
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
