import { Component, OnInit } from '@angular/core';
import { Router}    from '@angular/router';
import {MessageService} from '../../services/message.service';
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
  private selected: number;

  constructor(private gameService: GameService, private messageService: MessageService, private constants: Configuration, private router: Router) {
    this.selected = 0;
  }

  ngOnInit() {
      this.gameService.getAll().subscribe((data:Game[]) =>
          this.games = data,
          error => console.log(error),
          () => console.log('Get all games complete')
      );

      this.messageService.messages$.subscribe(msg => {
          this.handleControls(msg);
      });
  }

  handleControls(msg: any): void {
      if(msg.id == 'client.controls' && msg.data) {
          if(msg.data.right) {
                if(this.selected < this.games.length) {
                      this.selected ++;
                      return;
                }
          }
          if(msg.data.left) {
              if(this.selected !== 0) {
                  this.selected --;
              }
          }
          if(msg.data.up) {
              //taken into account that the games grid is 3 tiles per row.
              if(!(this.selected - 3 < 0)) {
                  this.selected -= 3;
              }
              this.selected -= 3;
          }
          if(msg.data.down) {
              if(!(this.selected - 3 < 0)) {
                  this.selected -= 3;
              }
              return;
          }
          if(msg.data.select) {
              this.startGame(this.games[this.selected]);
          }
      }
      return;
  }

  startGame(game: Game) {
    this.router.navigate(['/play', game.id]);
  }

  onSelect(game: Game) {
    this.router.navigate(['/games', game.id]);
  }

  onLeft() {
    if(this.selected > 0)
      this.selected -= 1;
  }

  onRight() {
    if(this.selected < this.games.length - 1)
      this.selected += 1;
  }

  // openGame(game: Game) {
  //   window.open(game.url,game.name,"fullscreen=yes")
  // }
}
