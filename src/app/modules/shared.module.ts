import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from "@angular/material/dialog";
import { TrCurrencyPipe } from 'tr-currency';
import { PaginationComponent } from '../common/pagination/pagination.component';
import { BlankComponent } from '../components/blank/blank.component';
import { SectionComponent } from '../components/section/section.component';


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
    ReactiveFormsModule,
    PaginationComponent
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
