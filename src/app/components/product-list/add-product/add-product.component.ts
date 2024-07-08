import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../modules/shared.module';
import { UploadFile } from '../../../models/uploadFile';
import { UploadService } from '../../../services/upload.service';
import { CategoryService } from '../../../services/category.service';
import { TypeModel } from '../../../models/type.model';
import { CategoryResponse } from '../../../reponse/categoryResponse';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
interface ImageInfo {
  src: string;
  name: string;
}
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})

export class AddProductComponent implements OnInit {
  imageSrcs: ImageInfo[] = [];

  imageSrcSetProduct: string | ArrayBuffer | null = null;
  // file: File | null = null; // Declare file as a global variable
  fileName: string = '';

  uploadFile: UploadFile = {
    file: null, 
    file_name: '',
    description: '',
    file_directory: '/notification',
    doc_type_id: '',
    type: ''
  }
  uploadFileImages: UploadFile = {
    file: null, 
    file_name: '',
    description: '',
    file_directory: '/notification',
    doc_type_id: '',
    type: ''
  }
  listImage : string[] = [];
  category : string[] = [];
  categorySelect :string ='';
  productDTo : Product ={
    image: '',
    file_id: this.listImage,
    product_code:'' ,
    bar_code: 1234569991,
    attribute_id: [],
    product_name: '',
    description_short: '',
    description_long: '',
    price: 0,
    promotional_price: 0,
    quantity: 0,
    category_id: this.category,
}
typeModel? :TypeModel;
categories: CategoryResponse[] = [];

  constructor(
    private uploadService : UploadService,
    private categoryService: CategoryService,
     private productService : ProductService) { }

  ngOnInit() {
    this.getCategories()
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i] as File; // Type assertion to File
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imageInfo: ImageInfo = {
            src: e.target.result,
            name: file.name // Access 'name' property of 'File'
          };
        this.uploadFileImages.file_name =this.fileName;
        this.uploadFileImages.file=file;
        this.uploadFileImages.type ='PRODUCT_IMAGE';
        this.uploadFile.type='PRODUCT_IMAGE';
          this.uploadService.uploadImages(this.uploadFileImages).subscribe({
            next: (response :any) => {
              if(response.result_data.file_id){
                this.listImage.push(response.result_data.file_id.toString());
              }
            },
            error: (error) => {
              // Handle error while inserting the product
              alert(error.error)
              console.error('Error inserting product:', error);
            }
          });  
          this.imageSrcs.push(imageInfo);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  

 removeImage(index: number): void {
   this.imageSrcs.splice(index, 1);
 }

 onFileSelectedSetProduct(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0] as File; ;
    this.fileName = file.name;
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (result !== undefined) {
        this.imageSrcSetProduct = result;
        this.uploadFile.file_name =this.fileName;
        this.uploadFile.file=file;
        this.uploadFile.type='PRODUCT_IMAGE';
        this.uploadService.uploadImages(this.uploadFile).subscribe({
          next: (response) => {
            if(response.result_data.file_id){
            }
            this.productDTo.image=response.result_data.file_id;
          },
          error: (error) => {
            // Handle error while inserting the product
            alert(error.error)
            console.error('Error inserting product:', error);
          }
        });  
      }
    };

    reader.readAsDataURL(file);
  }
}
onFileInputClickSetProduct(): void {
  const fileInputP = document.getElementById('fileInputProduct') as HTMLInputElement;
  fileInputP.click();
}

// onFileInputClick(): void {
//   const fileInput = document.getElementById('fileInput') as HTMLInputElement;
//   fileInput.click();
// }

getCategories() {
  this.typeModel = {
    type: ["PRODUCT_CATEGORY"]
  };
  this.categoryService.getCategories(this.typeModel).subscribe({
    next: (response:any) => {
      this.categories = response.result_data?.categoryInfo;
    },
    complete: () => {
    },
    error: (error: any) => {
      console.error('Error fetching categories:', error);
    }
  });
}

insertProduct() {    
  this.productService.inseProduct(this.productDTo).subscribe({
    next: (response) => {
      debugger
      if(response.result_data.file_id){
       
      }
    },
    error: (error) => {
      // Handle error while inserting the product
      alert(error.error)
      console.error('Error inserting product:', error);
    }
  });    
}
changeCategory(e:Event){
  this.category.push(e.toString());
}
}