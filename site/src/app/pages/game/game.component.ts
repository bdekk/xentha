import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {GameService} from '../../services/game.service';
import {Game} from '../../models/game';
import { Configuration } from '../../app.constants';

@Component({
  selector: 'app-game',
  templateUrl: 'game.component.html',
  styleUrls: ['game.component.css'],
  providers: [GameService, Configuration]
})
export class GameComponent implements OnInit {
  private sub: any;
  private game: Game;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: GameService,
    private constants: Configuration) {
    }

  ngOnInit() {
    var me = this;
    this.sub = this.route.params.subscribe(params => {
      let id = +params['id']; // (+) converts string 'id' to a number
      this.service.getOne(id).subscribe((data:Game) =>
        me.game = data
      );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
