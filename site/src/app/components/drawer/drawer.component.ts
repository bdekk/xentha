import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { Routes, RouterModule } from '@angular/router';


@Component({
  selector: 'drawer',
  templateUrl: 'drawer.component.html',
  styleUrls: ['drawer.component.css']
})
export class Drawer {
  @Input('user') user: User;

  constructor() {
  }

}
