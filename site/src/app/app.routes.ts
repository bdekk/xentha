// ====== ./app/app.routes.ts ======

// Imports
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

/** why do I have to declare these twice? */
import { GamesComponent } from './pages/games/games.component';
import { GameComponent } from './pages/game/game.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';
import { MyGamesComponent } from './pages/mygames/mygames.component';
import { PlayComponent } from './pages/play/play.component';

// Route Configuration
const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'games', component: GamesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'games/:id', component: GameComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'mygames', component: MyGamesComponent },
  { path: 'play/:id', component: PlayComponent }

  // { path: 'dogs', component: DogListComponent }
];

// TODO: figure out why this is needed?
export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
