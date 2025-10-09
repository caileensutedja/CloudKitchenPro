import { ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
// import { provideBrowserGlobalErrorListeners } from '@angular/platform-browser';

import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withHashLocation())]
};
