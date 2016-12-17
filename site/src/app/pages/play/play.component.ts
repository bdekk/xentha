import { Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {GameService} from '../../services/game.service';
import {SharedService} from '../../services/shared.service';
import {Game} from '../../models/game';
import { Configuration } from '../../app.constants';
import { MessageService } from '../../services/message.service';

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

    @ViewChild('gameframe') frame:ElementRef;

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private gameService: GameService,
      private constants: Configuration,
      private domSanitizer : DomSanitizer,
      private sharedService: SharedService,
      private messageService: MessageService) { }


    listenToIFrame(): void {

        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        var me = this;
        // Listen to message from child window
        eventer(messageEvent,function(e) {

          if(e.data) {
            let message = JSON.parse(e.data);
            if(message.data && message.id) {

              if(message.id === 'game.disconnect') {
                me.router.navigate(['/games']);
              }

              me.messageService.send({
                "id": message.id,
                "data": message.data
              });
            }
          }
        },false);

        this.messageService.messages$.subscribe(msg => {
          console.log(msg);
          let contentWindow = this.frame.nativeElement.contentWindow;
          if(contentWindow) {
            contentWindow.postMessage(JSON.stringify(msg),"*");
          }
        });

    }

    ngAfterViewInit(){
      console.log(this.frame);
    }

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

        this.listenToIFrame();
    }

    // get data form iframe and send it to the api.

}
