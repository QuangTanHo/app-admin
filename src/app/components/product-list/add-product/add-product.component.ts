import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../modules/shared.module';
import { UploadFile } from '../../../models/uploadFile';
import { UploadService } from '../../../services/upload.service';
import { CategoryService } from '../../../services/category.service';
import { TypeModel } from '../../../models/type.model';
import { CategoryResponse } from '../../../reponse/categoryResponse';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ProductListComponent } from '../product-list.component';
import { ShowProductComponent } from '../show-product/show-product.component';
interface ImageInfo {
  src: string;
  name: string;
}
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [SharedModule,DialogModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})

export class AddProductComponent implements OnInit {
  imageSrcs: ImageInfo[] = [];
  imageSrc: string | ArrayBuffer | null = null;
  @ViewChild('fileInputSetProduct') fileInputSetProduct!: ElementRef;
  @ViewChild('fileInputSetListProduct') fileInputSetListProduct!: ElementRef;
  images: { src: string | ArrayBuffer | null, name: string }[] = [];

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
    private uploadService: UploadService,
    private categoryService: CategoryService,
    private productService: ProductService,
    public dialog: Dialog) { }

  ngOnInit() {
    this.getCategories()
  }


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
      if(response.result_data.file_id){
       
      }
    },
    error: (error) => {
      alert(error.error)
      console.error('Error inserting product:', error);
    }
  });    
}
changeCategory(e:Event){
  this.category.push(e.toString());
}


onDragOverSetProduct(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
}

onDragLeaveSetProduct(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
}

onDragOverListproduct(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
}

onDragLeaveListproduct(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
}
onDrop(event: DragEvent) {
  debugger
  event.preventDefault();
  event.stopPropagation();
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    this.readFile(files[0]);
  }
}
onDropListProduct(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    this.readFileListProduct(files);
  }
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

readFile(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    this.imageSrcSetProduct = reader.result;
  };
  reader.readAsDataURL(file);
}
readFileListProduct(files: FileList) {
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      this.images.push({ src: reader.result, name: file.name });
    };
    reader.readAsDataURL(file);
  });
}
onAreaClickSetProduct() {
  this.fileInputSetProduct.nativeElement.click();
}
onDeleteClickSetProduct(event: MouseEvent) {
  event.stopPropagation();
  this.imageSrcSetProduct = null;
}

onFileSelectedListProduct(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.readFilesList(input.files);
  }
}

onAreaClickListproduct() {
  this.fileInputSetListProduct.nativeElement.click();
}

onDeleteClickListProduct(event: MouseEvent, index: number) {
  event.stopPropagation();
  this.images.splice(index, 1);
}

readFilesList(files: FileList) {
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      this.images.push({ src: reader.result, name: file.name });
    };
    reader.readAsDataURL(file);
  });
}
openDialog(): void {
  const dialogRef = this.dialog.open<string>(ShowProductComponent, {
    width: '250px',
  });

  dialogRef.closed.subscribe(result => {
    console.log('The dialog was closed');
  });
}
}