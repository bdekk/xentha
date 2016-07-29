import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth.service';
import { Configuration } from '../../app.constants';
import { Router}    from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  providers: [AuthService, Configuration]
})
export class LoginComponent implements OnInit {

  private data: any;
  private user: any;

  constructor(private authService: AuthService,  private router: Router) {
    this.data = {};
    this.user = null;
  }

  ngOnInit() {

  }

  login(data) {
      this.authService.login(data)
      .subscribe((data:User) => {
        if(data) {
          this.user = data;
          this.router.navigate(['/profile', data.id]);
        }
      },
      error => console.log(error),
      () => console.log('Login complete'));
  }

  register(data) {
    this.authService.create(data)
    .subscribe((data:User) =>
      this.user = data,
      error => console.log(error),
      () => console.log('Register complete'));
  }

}
