import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { TypeModel } from '../../models/type.model';
import { AttributeService } from '../../services/attribute.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attribute',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})
export class AttributeComponent implements OnInit {
  attributes: any; 
  typeModel? :TypeModel;
  constructor(
    private attributeService: AttributeService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getAttributes();
  }
  getAttributes() {
    this.typeModel = {
      type: ["PRODUCT_ATTRIBUTE"]
    };
    this.attributeService.getAttribute(this.typeModel).subscribe({
      next: (response:any) => {
        this.attributes = response.result_data?.attributeInfo;
      },
      complete: () => {
      },
      error: (error: any) => {
        console.error('Error fetching attributes:', error);
      }
    });
  }
  insertAttribute() {
    this.router.navigate(['/add-attribute']);
  }
  updateAttribute(attributeId: string) {
    this.router.navigate(['/update-attribute', attributeId]);
  }


  deleteAttribute(attribute: any) {
    const confirmation = window
      .confirm('Are you sure you want to delete this Attribute?');
    if (confirmation) {
      this.attributeService.deleteAttribute(attribute.attribute_id).subscribe({
        next: (response: string) => {
          location.reload();
        },
        complete: () => {
        },
        error: (error: any) => {
          alert(error.error)
          console.error('Error fetching attributes:', error);
        }
      });
    }
  }

}

