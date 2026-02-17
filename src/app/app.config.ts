import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { ThemeService } from './core/services/theme.service';
import { provideStore } from '@ngrx/store';
import { AUTH_REDUCER } from './core/stores/auth/auth.reducer';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './core/stores/auth/auth.effect';

export const appConfig: ApplicationConfig = {
  providers: [
    ThemeService,
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([loadingInterceptor]), withFetch()),
    provideStore({
      auth: AUTH_REDUCER,
    }),
    provideEffects(AuthEffects),
  ],
};
