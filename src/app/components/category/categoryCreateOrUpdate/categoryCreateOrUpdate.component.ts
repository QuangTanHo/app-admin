import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../modules/shared.module';
import { UploadService } from '../../../services/upload.service';
import { CategoryService } from '../../../services/category.service';
import { UploadFile } from '../../../models/uploadFile';
import { Category } from '../../../models/category';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categoryCreateOrUpdate',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './categoryCreateOrUpdate.component.html',
  styleUrls: ['./categoryCreateOrUpdate.component.scss']
})
export class CategoryCreateOrUpdateComponent implements OnInit {
  imageSrc: string | ArrayBuffer | null = null;
  file: File | null = null; // Declare file as a global variable
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
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id') as string;
    });
    if(this.categoryId){

    }
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

  insertCategory() {    
    if(!this.fileName){
      return;
    }
    this.uploadFile.type='PRODUCT_IMAGE';
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
            // Handle error while inserting the product
            alert(error.error)
            console.error('Error inserting product:', error);
          }
        }); 
        }
      },
      error: (error) => {
        // Handle error while inserting the product
        alert(error.error)
        console.error('Error inserting product:', error);
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
        debugger
        if(response){

        }  
        // this.updatedCategory = { ...category };                        
      },
      complete: () => {
        
      },
      error: (error: any) => {
        
      }
    });     
  }
}
