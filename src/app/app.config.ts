import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule, provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import {MatIconModule} from '@angular/material/icon';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([TokenInterceptor])),
    importProvidersFrom(
      BrowserAnimationsModule,
      NgxSpinnerModule,
      MatIconModule,
      MatAutocompleteModule,
      BrowserAnimationsModule 

    ), provideAnimationsAsync(),
    provideAnimations(), // required animations providers
    provideToastr(
      {
        timeOut: 10000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      }
    ),
  ]
};
