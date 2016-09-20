import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {

  //TODO: later create a room model.
  private room: any;

  constructor() {

  }

  public setRoom(room: any): void {
     this.room = room;
  }

  public getRoom(): any {
      return this.room;
  }

}
