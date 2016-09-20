import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user';
import { Configuration } from '../../app.constants';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css'],
  providers: [AuthService, Configuration]
})
export class ProfileComponent implements OnInit {
  private sub: any;
  private profile: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AuthService,
    private constants: Configuration) {
    }

  ngOnInit() {
    var me = this;
    this.sub = this.route.params.subscribe(params => {
      let id = +params['id']; // (+) converts string 'id' to a number
      this.service.getOne(id).subscribe((data:User) =>
        me.profile = data
      );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
