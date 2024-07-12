import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ProductDTO } from '../../models/modelDTO/productDTO';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../common/toast.service';
import { ProductRespone } from '../../reponse/productRespone';
import { UploadService } from '../../services/upload.service';
import { PaginationComponent } from '../../common/pagination/pagination.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [SharedModule, MatIconModule,PaginationComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  productDTO : ProductDTO ={
    product_name: '',
    product_code: '',
    page_number: 1,
    page_size: 10,
    sort_by: 'productName',
    sort_direction: 'asc'
  }
  totalRecords = 0;
  productRespone : ProductRespone[]=[] ;
  constructor(
    private productService : ProductService,
    private uploadService : UploadService,
    private toatService : ToastService
  ) { }

  ngOnInit() {
    this.getListProduct(this.productDTO.page_number ,this.productDTO.page_size);
  }
  
  getListProduct(page : number ,size :number) {
    this.productDTO.page_number= page;
    this.productDTO.page_size = size;
    this.productService.getProduct(this.productDTO).subscribe({
      next: (response:any) => {
        this.productRespone = response.result_data.list_product;
        this.totalRecords = 20;
        this.productRespone.forEach( x =>{
          if(x.image){
          this.getImageById(x.image).then((result) => {
            x.srcImage= result;
          }).catch((error) => {
            console.error('Error fetching image:', error);
          });
        }
        })

      },
      complete: () => {
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
  searchProduct(){
   this.getListProduct(1,this.productDTO.page_size);
  }

  getImageById(file_id: string): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      this.uploadService.getOriginalImage(file_id).subscribe({
        next: (imageBlob) => {
          if (imageBlob) {
            const reader = new FileReader();
            reader.onload = () => {
              resolve(reader.result);
            };
            reader.onerror = () => {
              reject(new Error('Failed to read the file'));
            };
            reader.readAsDataURL(imageBlob);
          } else {
            reject(new Error('No image blob received'));
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }
  
  onPageChanged(page: number): void {
    this.getListProduct(page, this.productDTO.page_size);
  }

  deleteProduct(product: ProductRespone) {
    const confirmation = window
      .confirm('Are you sure you want to delete this c?');
    if (confirmation) {
      this.productService.deleteProduct(product.product_id).subscribe({
        next: (response: string) => {
          location.reload();
        },
        complete: () => {
        },
        error: (error: any) => {
          alert(error.error)
          console.error('Error fetching Product:', error);
        }
      });
    }
  }
}
