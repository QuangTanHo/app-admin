import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { TranslationPipe } from '../../common/pipes/translation.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // location.reload();
  }
}
