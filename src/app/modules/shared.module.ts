import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlankComponent } from '../components/blank/blank.component';
import { SectionComponent } from '../components/section/section.component';
import { FormsModule } from '@angular/forms';
import { TrCurrencyPipe } from 'tr-currency';

import {MatDialogModule} from "@angular/material/dialog";
import { PaginationComponent } from '../common/pagination/pagination.component';


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
    PaginationComponent
  ],
  exports: [
    CommonModule,
    BlankComponent, 
    SectionComponent,
    FormsModule,
    TrCurrencyPipe
  ]
})
export class SharedModule { }
