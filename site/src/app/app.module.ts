import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { Drawer } from './components/drawer';
import {Navbar} from './components/navbar';

import {Tabs} from './components/tabs';
import {Tab} from './components/tab';
import {AuthService} from './services/auth.service';
import {MessageService} from './services/message.service';
import {SocketService} from './services/socket.service';
import {SharedService} from './services/shared.service';
import { Configuration } from './app.constants';

import { routing, appRoutingProviders }  from './app.routes';

import { GamesComponent } from './pages/games/games.component';
import { GameComponent } from './pages/game/game.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';
import { MyGamesComponent } from './pages/mygames/mygames.component';
import { PlayComponent } from './pages/play/play.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    appRoutingProviders
  ],
  declarations: [
      Drawer,
      Navbar,
      Tab,
      Tabs,
      AppComponent,
      GamesComponent,
      GameComponent,
      LoginComponent,
      ProfileComponent,
      HomeComponent,
      MyGamesComponent,
      PlayComponent
  ],
  bootstrap:    [ AppComponent ],
  providers: [MessageService, SocketService, Configuration, AuthService, SharedService]
})
export class AppModule {}
