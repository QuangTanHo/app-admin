import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UploadService } from '../../../services/upload.service';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../modules/shared.module';
import { CategoryResponse } from '../../../reponse/categoryResponse';
import { TypeModel } from '../../../models/type.model';
import { ToastService } from '../../../common/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UploadFile } from '../../../models/uploadFile';

@Component({
  selector: 'app-category-update',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.scss']
})
export class CategoryUpdateComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  categoryId?: string;
  image: { src: string | ArrayBuffer | null, fileId: string, name: string } = { src: null, fileId: '', name: '' };
  file: File | null = null; // Declare file as a global variable
  fileName: string = '';
  category?: any;
  typeModel? :TypeModel;
  categories: CategoryResponse[] = []; 
  uploadFile: UploadFile = {
    file: null, 
    file_name: '',
    description: '',
    file_directory: '/notification',
    doc_type_id: '',
    type: ''
  };
  constructor(  
    private uploadService : UploadService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    public toatsService: ToastService, 
    private spinner: NgxSpinnerService,) { }

  ngOnInit() {
    this. getCategories();
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id') as string;
    });
    if(this.categoryId){
     this.getCategoryDetails();
    }
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.readFile(files[0]);
    }
  }
  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  onAreaClick() {
    this.fileInput.nativeElement.click();
  }
  onDeleteClick(event: MouseEvent, fileId :string) {
    event.stopPropagation();
    this.image.src = null;
    if(fileId){
      this.uploadService.deleteFileById(fileId).subscribe({
        next: (res :any) => {
          if (res.result_code === 1) {
            this.toatsService.showSuccess(res.result_msg);
          }else if(res.result_code === 0){
            this.toatsService.showError(res.result_data.msg);
          }
        },
        error: (error) => {
          this.toatsService.showError(error);
        }
      }); 
    }
    this.image.fileId = '';
    this.category.file_id='';

  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0] as File; ;
      this.fileName = file.name;
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result !== undefined) {
          this.image.src  = result;
          this.uploadFile.file_name =this.fileName;
          this.uploadFile.file=file;
        }
      };

      reader.readAsDataURL(file);
    }
  }
  changeCategory(e:Event){
    this.category.category_parent_id = e.toString();
  }
  changeCategoryType(e:Event){
    this.category.category_parent_id = e.toString();
  }

  getCategories() {

    this.typeModel = {
      type: ['PRODUCT_CATEGORY']
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

  getCategoryDetails(): void {
    let category = {
      category_id :this.categoryId,
      category_type: 'PRODUCT_CATEGORY'
    }
    this.categoryService.getDetailCategory(category).subscribe({
      next: (response : any) => { 
        if(response){
        this.category = response.result_data;
         this.category.category_parent_id = response.result_data.category_parent_id ? response.result_data.category_parent_id :'';
        if(this.category.file_id){
          this.getImagebById();
        }
        
        }                     
      },
      complete: () => {
        
      },
      error: (error: any) => {
        
      }
    });     
  }

getImagebById(){

  this.uploadService.getInforFileById(this.category.file_id).subscribe({
    next: (res) => {
      if(res){
        this.fileName = res.result_data.raw_file_name ;
        this.uploadService.getOriginalImage(this.category.file_id).subscribe({
            next: (imageBlob) => {
              if(imageBlob){
                const reader = new FileReader();
                reader.onload = () => {
                  this.image.src = reader.result;
                  this.image.fileId = this.category.file_id;
                };
                reader.readAsDataURL(imageBlob);
              }
            },
            error: (error) => {
              this.toatsService.showError(error);
            }
          }); 
      }
    },
    error: (error) => {
      this.toatsService.showError(error);
    }
  }); 
}
async updateImage(): Promise<string | null> {
  this.uploadFile.type = 'CATEGORY_IMAGE';
  try {
    const response = await this.uploadService.uploadImages(this.uploadFile).toPromise();
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

async  updateCategory() {
  this.spinner.show();
  if (this.fileName) {
    const fileId = await this.updateImage();
    if (fileId) {
      this.category.file_id = fileId;
    }
  }
  // this.category.category_type ='PRODUCT_CATEGORY';
  this.categoryService.updateCategory(this.category).subscribe({
    next: (response) => {
      this.spinner.hide();
      if (response.result_code === 1) {
        this.toatsService.showSuccess(response.result_msg);
      }else if(response.result_code === 0){
        this.toatsService.showError(response.result_data.msg);
      }
    },
    error: (error) => {
      this.spinner.hide();
      alert(error.error)
      console.error('Error inserting Category:', error);
    }
  });

}



}
