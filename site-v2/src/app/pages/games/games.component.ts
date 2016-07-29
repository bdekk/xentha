import { Component, OnInit } from '@angular/core';
import { Router}    from '@angular/router';

import {Game} from '../../models/game';
import {GameService} from '../../services/game.service';
import { Configuration } from '../../app.constants';

@Component({
  moduleId: module.id,
  selector: 'app-games',
  templateUrl: 'games.component.html',
  styleUrls: ['games.component.css'],
  providers: [GameService, Configuration]
})
export class GamesComponent implements OnInit {

  private games: Game [];

  constructor(private gameService: GameService, private constants: Configuration, private router: Router) {
  }

  ngOnInit() {
    this.gameService.getAll()
    .subscribe((data:Game[]) =>
      this.games = data,
      error => console.log(error),
      () => console.log('Get all games complete'));
  }

  onSelect(game: Game) {
    this.router.navigate(['/games', game.id]);
  }

}
