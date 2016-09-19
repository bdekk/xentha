import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {GameService} from '../../services/game.service';
import {Game} from '../../models/game';
import { Configuration } from '../../app.constants';

/** dom sanitizer **/
import {BrowserModule} from '@angular/platform-browser';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  moduleId: module.id,
  selector: 'app-play',
  templateUrl: 'play.component.html',
  styleUrls: ['play.component.css'],
  providers: [GameService, Configuration]
})
export class PlayComponent implements OnInit {
    private game: Game;
    private sub: any;

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private gameService: GameService,
      private constants: Configuration,
      private domSanitizer : DomSanitizer) { }

    ngOnInit() {
        // use the param id to retrieve the game data from the database and present the game :)
        var me = this;
        this.sub = this.route.params.subscribe(params => {
            let id = +params['id'];
            this.gameService.getOne(id).subscribe((data:Game) => {
                if(data) {
                    data.url = this.domSanitizer.bypassSecurityTrustResourceUrl(data.url);
                    me.game = data
                    console.log(data);
                }
            });
        });
    }

}
