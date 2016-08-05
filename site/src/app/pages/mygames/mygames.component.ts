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

  private filesToUpload: Array<File>;
  // me: any;

  constructor(private gameService: GameService, private constants: Configuration) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.gameData = {};
      this.myGames = [];
      this.filesToUpload = [];
      // this.me = this;
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
          this.addImage(game, image);
          // console.log(data);
          // me.myGames.push(data);
        }
      },
      error => console.log(error),
      () => console.log('Register complete'));
  }

  private addImage(game:Game, image:File) {
    var g = game;

    // this.makeFileRequest(this.url + game.id + '/image', [], this.filesToUpload).then((result) => {
    //   console.log(result);
    // }, (error) => {
    //   console.error(error);
    // });
    this.gameService.addImage(game.id, image).then((url:any) => {
      if(url) {
        console.log(g, url);
        g["image"] = url;
        this.myGames.push(g);
      }
    });
  }

  // public makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
  //     return new Promise((resolve, reject) => {
  //         var formData: any = new FormData();
  //         var xhr = new XMLHttpRequest();
  //         for(var i = 0; i < files.length; i++) {
  //             formData.append("uploads[]", files[i], files[i].name);
  //         }
  //         xhr.onreadystatechange = function () {
  //             if (xhr.readyState == 4) {
  //                 if (xhr.status == 200) {
  //                     resolve(JSON.parse(xhr.response));
  //                 } else {
  //                     reject(xhr.response);
  //                 }
  //             }
  //         }
  //         xhr.open("POST", url, true);
  //         xhr.send(formData);
  //     });
  // }

  public fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>> fileInput.target.files;
  }

}
