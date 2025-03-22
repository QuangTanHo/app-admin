import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslationPipe } from './common/pipes/translation.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule],
  template: `
  <router-outlet></router-outlet>
  <ngx-spinner bdColor = "rgba(0, 0, 0, 0.8)" size = "medium" color = "#fff" type = "ball-clip-rotate-multiple" [fullScreen] = "true"><p style="color: white" >  </p></ngx-spinner>`
})
export class AppComponent {}
