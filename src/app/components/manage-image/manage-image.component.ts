import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-image',
  standalone: true,
  imports: [SharedModule,CommonModule],
  templateUrl: './manage-image.component.html',
  styleUrls: ['./manage-image.component.scss']
})
export class ManageImageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
