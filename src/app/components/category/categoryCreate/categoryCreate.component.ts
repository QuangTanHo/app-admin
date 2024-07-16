import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../modules/shared.module';
import { UploadService } from '../../../services/upload.service';
import { CategoryService } from '../../../services/category.service';
import { UploadFile } from '../../../models/uploadFile';
import { Category } from '../../../models/category';
import { ActivatedRoute } from '@angular/router';
import { TypeModel } from '../../../models/type.model';
import { CategoryResponse } from '../../../reponse/categoryResponse';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../../common/toast.service';

@Component({
  selector: 'app-categoryCreateOrUpdate',
  standalone: true,
  imports: [SharedModule,CommonModule],
  templateUrl: './categoryCreate.component.html',
  styleUrls: ['./categoryCreate.component.scss']
})
export class CategoryCreateComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  imageSrc: string | ArrayBuffer | null = null;
  typeModel? :TypeModel;
  categories: CategoryResponse[] = []; 
  file: File | null = null; 
  fileName: string = '';
  uploadFile: UploadFile = {
    file: null, 
    file_name: '',
    description: '',
    file_directory: '/notification',
    doc_type_id: '',
    type: ''
  };

  category: Category = {
    category_parent_id: '',
    category_name: '',
    file_id: '',
    category_type: '',
  };
  categoryId?: string;
  constructor(
    private uploadService : UploadService,
    private categoryService: CategoryService,
    private spinner: NgxSpinnerService,
    public toatsService: ToastService,
  ) { }

  ngOnInit() {
    this.getCategories();
    
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0] as File; ;
      this.fileName = file.name;
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result !== undefined) {
          this.imageSrc = result;
          this.uploadFile.file_name =this.fileName;
          this.uploadFile.file=file;
        }
      };

      reader.readAsDataURL(file);
    }
  }
  onFileInputClick(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  changeCategory(e:Event){
    this.category.category_parent_id = e.toString();
  }
  changeCategoryType(e:Event){
    this.category.category_parent_id = e.toString();
  }

  async insertImage(): Promise<string | null> {
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
      return null;
    }
  }

  async  insertCategory() {
    this.spinner.show();
    if (this.fileName) {
      const fileId = await this.insertImage();
      if (fileId) {
        this.category.file_id = fileId;
      }
    }
    // this.category.category_type ='PRODUCT_CATEGORY';
    this.categoryService.insertCategory(this.category).subscribe({
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

  getCategoryDetails(): void {
    let category = {
      category_id :this.categoryId,
       category_type: 'PRODUCT_CATEGORY'
    }
    this.categoryService.getDetailCategory(category).subscribe({
      next: (response) => {    
        if(response){
     this.uploadService.uploadImages(this.uploadFile).subscribe({
      next: (response) => {
        if(response.result_data.file_id){
         this.category.file_id = response.result_data.file_id;
         this.category.category_type ='PRODUCT_CATEGORY';
         this.categoryService.insertCategory(this.category).subscribe({
          next: (response) => {
            if(response.result_data){
             
            }
          },
          
          error: (error) => {
            alert(error.error)
            console.error('Error inserting product:', error);
          }
        }); 
        }
      },
      error: (error) => {
        alert(error.error)
        console.error('Error inserting product:', error);
      }
    }); 

        }  
        // this.updatedCategory = { ...category };                        
      },
      complete: () => {
        
      },
      error: (error: any) => {
        
      }
    });     
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
      this.imageSrc = reader.result;
    };
    reader.readAsDataURL(file);
  }
  onAreaClick() {
    this.fileInput.nativeElement.click();
  }
  onDeleteClick(event: MouseEvent) {
    event.stopPropagation();
    this.imageSrc = null;
  }
}
