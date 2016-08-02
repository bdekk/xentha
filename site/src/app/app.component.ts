import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import {User} from './models/user';
import {AuthService} from './services/auth.service';
import { Configuration } from './app.constants';
import { Drawer } from './components/drawer';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES, Drawer],
  providers: [AuthService, Configuration]

})
export class AppComponent {

  private user: User;
  private snackbar: any;
  title = "bla";

  constructor() {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.snackbar = document.querySelector('#xentha-snackbar');
  }

  logout() {
    this.user = undefined;
    localStorage.removeItem('user');
    this.snackbar.MaterialSnackbar.showSnackbar('signed out..');
  }

}
