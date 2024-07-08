import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../../services/upload.service';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../modules/shared.module';

@Component({
  selector: 'app-category-update',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.scss']
})
export class CategoryUpdateComponent implements OnInit {
  categoryId?: string;
  imageSrc: string | ArrayBuffer | null = null;
  file: File | null = null; // Declare file as a global variable
  fileName: string = '';
  category?: any;
  constructor(  
     private uploadService : UploadService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id') as string;
    });
    if(this.categoryId){
     this.getCategoryDetails();
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
        }
      };

      reader.readAsDataURL(file);
    }
  }
  onFileInputClick(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }



  getCategoryDetails(): void {
    let category = {
      category_id :this.categoryId,
       category_type: 'PRODUCT_CATEGORY'
    }
    this.categoryService.getDetailCategory(category).subscribe({
      next: (response : any) => {      
        debugger
        if(response){
        this.category = response.result_data;
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
