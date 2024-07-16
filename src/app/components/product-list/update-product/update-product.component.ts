import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../../modules/shared.module';
import { UploadFile } from '../../../models/uploadFile';
import { Product } from '../../../models/product';
import { TypeModel } from '../../../models/type.model';
import { UploadService } from '../../../services/upload.service';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { ToastService } from '../../../common/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

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
  selector: 'app-update-product',
  standalone: true,
  imports: [SharedModule,MatDialogModule],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})

export class UpdateProductComponent implements OnInit {
  image: { src: string | ArrayBuffer | null, fileId: string, name: string } = { src: null, fileId: '', name: '' };
  @ViewChild('fileInputSetProduct') fileInputSetProduct!: ElementRef;
  @ViewChild('fileInputSetListProduct') fileInputSetListProduct!: ElementRef;
  images: { src: string | ArrayBuffer | null, name: string, fileId: string }[] = [];

  productId?: string;
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
  productDTo : any = {};
typeModel? :TypeModel;
categories: Category[] = [];

  constructor(
    private uploadService: UploadService,
    private categoryService: CategoryService,
    private productService: ProductService,
    public toatsService: ToastService, 
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getCategories()
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id') as string;
    });
    if(this.productId){
        this.getListProductId();
    }
  }

  async getListProductId() {
    try {
      const response: any = await this.productService.getProductById(this.productId as string).toPromise();
      if (response) {
        this.productDTo = response.result_data;
        if (response.result_data.product_category_list.length > 0) {
          this.setCheckedStatus(this.categories, response.result_data.product_category_list);
        }
  
        try {
          const { fileName, imageSrc, fileId } = await this.getImagebById(this.productDTo.image);
          this.image.src = imageSrc;
          this.image.name = fileName;
          this.image.fileId = fileId;
        } catch (error) {
          console.error('Error fetching image data:', error);
        }
        
        if (this.productDTo.image_list.length > 0) {
          for (const element of this.productDTo.image_list) {
            if (element.file_id) {
              try {
                const { fileName, imageSrc, fileId } = await this.getImagebById(element.file_id);
                this.images.push({ src: imageSrc, name: fileName, fileId: fileId });
              } catch (error) {
                console.error('Error fetching image data:', error);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
    console.log(this.images);
  }
  

 getCategories() {
  this.typeModel = {
    type: ["PRODUCT_CATEGORY"]
  };
  this.categoryService.getCategories(this.typeModel).subscribe({
    next: (response:any) => {
      this.categories = response.result_data?.categoryInfo;
      this.addCheckedProperty(this.categories);
    },
    complete: () => {
    },
    error: (error: any) => {
      console.error('Error fetching categories:', error);
    }
  });
}

async updateProduct() {    
  this.spinner.show();
  this.uploadFileImages;

  if (this.uploadFile.file) {
    const fileIdSetproduct = await this.insertImage(this.uploadFile);
    if (fileIdSetproduct) {
      this.productDTo.image = fileIdSetproduct;
    }
  }
  const filteredFileIds = this.images.filter(image => image.fileId).map(image => image.fileId);
  if (this.listUploadFileImages.length > 0) {
    const fileIdPromises = this.listUploadFileImages.map(async (x) => {
      const fileId = await this.insertImage(x);
      return fileId;
    });

    const fileIds = await Promise.all(fileIdPromises) as [];
    fileIds.forEach(x =>{
      filteredFileIds.push(x);
    })
  }

 let modelUpdate = {
    product_id: this.productId,
    product_code: this.productDTo.product_code,
    bar_code: this.productDTo.bar_code,
    image:  this.productDTo.image,
    file_id: filteredFileIds,
    attribute_id: [],
    product_name:this.productDTo.product_name,
    description_short: this.productDTo.description_short,
    description_long: this.productDTo.description_long,
    price: this.productDTo.price,
    promotional_price: this.productDTo.promotional_price,
    quantity: this.productDTo.quantity,
    category_id: this.getCheckedCategoryIds(this.categories)
}
  this.productService.updateProduct(modelUpdate).subscribe({
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
}

onDragLeaveListproduct(event: DragEvent) {
  event.preventDefault();
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
  debugger
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
  debugger
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      this.images.push({ src: reader.result, name: file.name ,fileId :''});
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
      this.images.push({ src: reader.result, name: file.name ,fileId :''});
      const uploadFileImage = {
        file: file,
        file_name: file.name,
        description: '',
        file_directory: '/notification',
        doc_type_id: '',
        type: 'PRODUCT_IMAGE'
      };

      this.listUploadFileImages.push(uploadFileImage);
    };
    reader.readAsDataURL(file);
  });
}
// openDialog(): void {
//   const dialogRef = this.dialog.open<string>(ShowProductComponent, {
//     width: '250px',
//   });

//   dialogRef.closed.subscribe(result => {
//     console.log('The dialog was closed');
//   });
// }
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
    category.checked = false; 
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

setCheckedStatus(categories: Category[], listId: string[]) {
  categories.forEach(category => {
    if (listId.some((id:any) => id.category_id === category.category_id)) {
      category.checked = true;
    }
    if (category.category_parent_id) {
      this.setCheckedStatus(category.category_parent_id, listId);
    }
  });
}

onCheckboxChange(category: Category) {
  category.checked = !category.checked;
}

getImage(file_id: string): Promise<string | ArrayBuffer | null> {
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

async getFileName(file_id: string): Promise<string> {
  try {
    const res = await this.uploadService.getInforFileById(file_id).toPromise();
    if (res) {
      const fileName = res.result_data.raw_file_name;
      return fileName;
    } else {
      throw new Error('No response received');
    }
  } catch (error) {
    this.toatsService.showError(error as string);
    throw error;
  }
}

async getImagebById(file_id :string): Promise<{ fileName: string, imageSrc: string | ArrayBuffer | null, fileId: string }> {
  try {
    const res = await this.uploadService.getInforFileById(file_id).toPromise();
    if (!res) {
      throw new Error('No response received');
    }

    const fileName = res.result_data.raw_file_name;

    const imageBlob = await this.uploadService.getOriginalImage(file_id).toPromise();
    if (!imageBlob) {
      throw new Error('No image blob received');
    }

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve({
          fileName: fileName,
          imageSrc: reader.result,
          fileId: file_id,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });

  } catch (error) {
    this.toatsService.showError(error as string);
    throw error;
  }
}


}
