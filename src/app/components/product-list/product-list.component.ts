import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
