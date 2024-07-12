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
import { MatMenuModule, MatMenuPanel } from '@angular/material/menu';
import { ToastService } from '../../../common/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
interface ImageInfo {
  src: string;
  name: string;
}

interface Category {
  category_id: string;
  category_name: string;
  category_parent_id: Category[] | null;
  file_id: string;
  category_type: string;
  create_date: string;
  modify_date: string | null;
  checked?: boolean;
}
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [SharedModule,DialogModule,MatMenuModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})

export class AddProductComponent implements OnInit {
  image: { src: string | ArrayBuffer | null, fileId: string, name: string } = { src: null, fileId: '', name: '' };
  @ViewChild('fileInputSetProduct') fileInputSetProduct!: ElementRef;
  @ViewChild('fileInputSetListProduct') fileInputSetListProduct!: ElementRef;
  images: { src: string | ArrayBuffer | null, name: string }[] = [];


  uploadFile: UploadFile = {
    file: null, 
    file_name: '',
    description: '',
    file_directory: '/notification',
    doc_type_id: '',
    type: 'PRODUCT_IMAGE'
  }
  
  uploadFileImages: UploadFile = {
    file: null, 
    file_name: '',
    description: '',
    file_directory: '/notification',
    doc_type_id: '',
    type: 'PRODUCT_IMAGE'
  };
  listUploadFileImages:UploadFile []=[];
  listImage : string[] = [];
  // category : string[] = [];
  categorySelect :string ='';
  productDTo : Product ={
    image: '',
    file_id: this.listImage,
    product_code:'' ,
    bar_code: 1234569991,
    attribute_id: ['a2dc8784616546fba2691f53b6f0e33d'],
    product_name: '',
    description_short: '',
    description_long: '',
    price: 0,
    promotional_price: 0,
    quantity: 0,
    category_id: [] = [],
}
typeModel? :TypeModel;
categories: Category[] = [];

  constructor(
    private uploadService: UploadService,
    private categoryService: CategoryService,
    private productService: ProductService,
    public toatsService: ToastService, 
    private spinner: NgxSpinnerService,
    public dialog: Dialog) { }

  ngOnInit() {
    this.getCategories()
    this.addCheckedProperty(this.categories);
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

async insertProduct() {    
debugger
  this.spinner.show();
  if (this.image.src) {
    const fileId = await this.insertImage(this.uploadFile);
    if (fileId) {
      this.productDTo.image = fileId;
    }
  }

  if (this.listUploadFileImages.length > 0) {
    const fileIdPromises = this.listUploadFileImages.map(async (x) => {
      const fileId = await this.insertImage(x);
      return fileId;
    });

    const fileIds = await Promise.all(fileIdPromises) as [];
    if(fileIds.length >0){
      this.productDTo.file_id = fileIds;
    }
  }
  this.productDTo.category_id = this.getCheckedCategoryIds(this.categories);
  this.productService.inseProduct(this.productDTo).subscribe({
    next: (response) => {
      if(response.result_data){
        this.spinner.hide();
      if (response.result_code === 1) {
        this.toatsService.showSuccess(response.result_msg);
      }else if(response.result_code === 0){
        this.toatsService.showError(response.result_data.msg);
      }
      }
    },
    error: (error) => {
      alert(error.error)
      console.error('Error inserting product:', error);
    }
  });    
}


async insertImage(uploadFile : UploadFile): Promise<string | null> {
  try {
    const response = await this.uploadService.uploadImages(uploadFile).toPromise();
    if (response.result_data.file_id) {
      return response.result_data.file_id;
    } else {
      return null;
    }
  } catch (error) {
    this.spinner.hide();
    console.error('Upload lỗi :', error);
    return null;
  }
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
  // event.stopPropagation();
}

onDragLeaveListproduct(event: DragEvent) {
  event.preventDefault();
  // event.stopPropagation();
}
onDrop(event: DragEvent) {
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
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (result !== undefined) {
        this.image.src = result;
        this.image.name = file.name;
        this.uploadFile.file=file;
        this.uploadFile.type='PRODUCT_IMAGE';
      }
    };

    reader.readAsDataURL(file);
  }
}

readFile(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    this.image.src= reader.result;
    this.image.name= file.name
  };
  reader.readAsDataURL(file);
}
readFileListProduct(files: FileList) {
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      this.images.push({ src: reader.result, name: file.name });
      this.uploadFileImages.file_name =file.name;
      this.uploadFileImages.file=file;
      this.uploadFileImages.type='PRODUCT_IMAGE';
      this.listUploadFileImages.push(this.uploadFileImages);
    };
    reader.readAsDataURL(file);
  });
}
onAreaClickSetProduct() {
  this.fileInputSetProduct.nativeElement.click();
}
onDeleteClickSetProduct(event: MouseEvent) {
  event.stopPropagation();
  this.image.src = null;
}

onFileSelectedListProduct(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.readFilesList(input.files);
  }
}

onAreaClickListproduct() {
  const fileInput = document.getElementById('fileInputSetListProduct') as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
}

onDeleteClickListProduct(event: MouseEvent, index: number) {
  event.stopPropagation();
  this.images.splice(index, 1);
  this.listUploadFileImages.splice(index,1);
}

readFilesList(files: FileList) {
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      this.images.push({ src: reader.result, name: file.name });
      this.uploadFileImages.file_name =file.name;
      this.uploadFileImages.file=file;
      this.uploadFileImages.type='PRODUCT_IMAGE';
      this.listUploadFileImages.push(this.uploadFileImages);
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
// click theo cha con

// onCheckboxChange(category: Category) {
//   if (category.category_parent_id) {
//     category.category_parent_id.forEach(child => {
//       child.checked = category.checked;
//       this.onCheckboxChange(child);
//     });
//   }
// }

// logCheckedCategoryIds() {
//   const checkedIds = this.getCheckedCategoryIds(this.categories1);
//   console.log('Checked Category IDs:', checkedIds);
// }

// getCheckedCategoryIds(categories: Category[]): string[] {
//   const checkedIds: string[] = [];
//   this.collectCheckedIds(categories, checkedIds);
//   return checkedIds;
// }

// private collectCheckedIds(categories: Category[], checkedIds: string[]) {
//   categories.forEach(category => {
//     if (category.checked) {
//       checkedIds.push(category.category_id);
//     }
//     if (category.category_parent_id) {
//       this.collectCheckedIds(category.category_parent_id, checkedIds);
//     }
//   });
// }
addCheckedProperty(categories: Category[]) {
  categories.forEach(category => {
    category.checked = false; // Initialize checked to false
    if (category.category_parent_id) {
      this.addCheckedProperty(category.category_parent_id);
    }
  });
}
logCheckedCategoryIds() {
  const checkedIds = this.getCheckedCategoryIds(this.categories);
}

getCheckedCategoryIds(categories: Category[]): string[] {
  const checkedIds: string[] = [];
  this.collectCheckedIds(categories, checkedIds);
  return checkedIds;
}

private collectCheckedIds(categories: Category[], checkedIds: string[]) {
  categories.forEach(category => {
    if (category.checked) {
      checkedIds.push(category.category_id);
    }
    if (category.category_parent_id) {
      this.collectCheckedIds(category.category_parent_id, checkedIds);
    }
  });
}
}