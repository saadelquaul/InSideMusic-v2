import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { trackReducer } from './store/track/track.reducer';
import { TrackEffects } from './store/track/track.effects';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    provideStore({
      track: trackReducer,
    }),
    provideEffects([TrackEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ],
};
