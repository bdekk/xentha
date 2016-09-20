import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {GameService} from '../../services/game.service';
import {SharedService} from '../../services/shared.service';
import {Game} from '../../models/game';
import { Configuration } from '../../app.constants';

/** dom sanitizer **/
import {BrowserModule} from '@angular/platform-browser';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-play',
  templateUrl: 'play.component.html',
  styleUrls: ['play.component.css'],
  providers: [GameService, Configuration]
})
export class PlayComponent implements OnInit {
    private game: Game;
    private safeGameUrl: SafeResourceUrl;
    private sub: any;

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private gameService: GameService,
      private constants: Configuration,
      private domSanitizer : DomSanitizer,
      private sharedService: SharedService) { }

    ngOnInit() {
        // use the param id to retrieve the game data from the database and present the game :)
        var me = this;
        this.sub = this.route.params.subscribe(params => {
            let id = +params['id'];
            this.gameService.getOne(id).subscribe((data:Game) => {
                var room = me.sharedService.getRoom();
                if(data && room) {

                    var urlWithRoomCode = data.url + '?room=' + room.roomCode;

                    me.safeGameUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(urlWithRoomCode);
                    me.game = data
                    console.log(data);
                }
            });
        });
    }

}
