import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { ROUTER_DIRECTIVES } from '@angular/router';


@Component({
  moduleId: module.id,
  selector: 'drawer',
  templateUrl: 'drawer.component.html',
  styleUrls: ['drawer.component.css'],
  directives: [ROUTER_DIRECTIVES]
  // directives: [RouterLink, RouterLinkActive]
})
export class Drawer {
  @Input('user') user: User;

  constructor() {
  }

}
