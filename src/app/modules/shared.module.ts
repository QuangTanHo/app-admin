import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrCurrencyPipe } from 'tr-currency';
import { BlankComponent } from '../components/blank/blank.component';
import { SectionComponent } from '../components/section/section.component';

import { MatDialogModule } from "@angular/material/dialog";


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    BlankComponent,
    SectionComponent,
    FormsModule,
    TrCurrencyPipe,
    MatDialogModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    BlankComponent,
    SectionComponent,
    FormsModule,
    TrCurrencyPipe,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
