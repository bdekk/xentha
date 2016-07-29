// ====== ./app/app.routes.ts ======

// Imports
import { provideRouter, RouterConfig } from '@angular/router';
import { GamesComponent } from './pages/games/games.component';
import { GameComponent } from './pages/game/game.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
// import { HomeComponent } from './pages/login/home.component';

// Route Configuration
export const routes: RouterConfig = [
  // { path: '', component: HomeComponent },
  { path: 'games', component: GamesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'games/:id', component: GameComponent },
  { path: 'profile/:id', component: ProfileComponent }

  // { path: 'dogs', component: DogListComponent }
];

// Export routes
export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
