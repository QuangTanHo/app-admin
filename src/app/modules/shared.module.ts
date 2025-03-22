import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from "@angular/material/dialog";
import { TrCurrencyPipe } from 'tr-currency';
import { PaginationComponent } from '../common/pagination/pagination.component';
import { BlankComponent } from '../components/blank/blank.component';
import { SectionComponent } from '../components/section/section.component';
import { TranslationPipe } from '../common/pipes/translation.pipe';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { OAuthModule } from 'angular-oauth2-oidc';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    BlankComponent,
    SectionComponent,
    FormsModule,
    HttpClientModule,
    TrCurrencyPipe,
    MatDialogModule,
    ReactiveFormsModule,
    PaginationComponent,
    TranslationPipe,
    MatAutocompleteModule,
    OAuthModule.forRoot()
  ],
  exports: [
    CommonModule,
    BlankComponent,
    SectionComponent,
    FormsModule,
    TrCurrencyPipe,
    ReactiveFormsModule, 
    TranslationPipe
  ],
  providers: [
    // provideHttpClient(withInterceptorsFromDi()),
    // { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
})
export class SharedModule { }
