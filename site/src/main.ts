import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);

// import { bootstrap } from '@angular/platform-browser-dynamic';
// import { enableProdMode } from '@angular/core';
// import { AppComponent, environment, APP_ROUTER_PROVIDERS} from './app/';
// import {HTTP_PROVIDERS} from '@angular/http';
//
// if (environment.production) {
//   enableProdMode();
// }
//
// bootstrap(AppComponent, [
//   APP_ROUTER_PROVIDERS, HTTP_PROVIDERS
// ])
// .catch(err => console.error(err));
