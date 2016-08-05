import { Component, OnInit } from '@angular/core';
import {Game} from '../../models/game';
import {GameService} from '../../services/game.service';
import { Configuration } from '../../app.constants';
import { User } from '../../models/user';

@Component({
  moduleId: module.id,
  selector: 'app-mygames',
  templateUrl: 'mygames.component.html',
  styleUrls: ['mygames.component.css'],
  providers: [GameService, Configuration]
})
export class MyGamesComponent implements OnInit {

  private myGames: Game [];
  private user: User;

  private gameData: any;
  private gameImage: any;

  me: any;

  constructor(private gameService: GameService, private constants: Configuration) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.gameData = {};
      this.myGames = [];

      this.me = this;
  }

  ngOnInit() {
    this.gameService.getAll()
    .subscribe((data:Game[]) =>
      this.myGames = data,
      error => console.log(error),
      () => console.log('Get all games complete'));
  }

  public createGame(data, image) {
    data["authorId"] = this.user.id;

    this.gameService.create(data)
    .subscribe((game:Game) => {
        if(game) {
          me.addImage(game, image);
          // console.log(data);
          // me.myGames.push(data);
        }
      },
      error => console.log(error),
      () => console.log('Register complete'));
  }

  private addImage(game, image) {
    var g = game;
    this.gameService.addImage(game.id, image)
    .subscribe((url:string) => {
        if(url) {
          console.log(g, url);
          g.image = url;
          me.myGames.push(g);
        }
      },
      error => console.log(error),
      () => console.log('Register complete'));
  }

}
