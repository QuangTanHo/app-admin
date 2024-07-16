import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../modules/shared.module';
import { UploadService } from '../../../services/upload.service';
import { TypeModel } from '../../../models/type.model';
import { UploadFile } from '../../../models/uploadFile';
import { AttributeService } from '../../../services/attribute.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../../common/toast.service';
import { Attribute } from '../../../models/attribute';

@Component({
  selector: 'app-add-attribute',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-attribute.component.html',
  styleUrls: ['./add-attribute.component.scss']
})
export class AddAttributeComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  imageSrc: string | ArrayBuffer | null = null;
  typeModel? :TypeModel;
  attributes: any; 
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

  attribute: Attribute  = {
    attribute_parent_id: '',
    attribute_name: '',
    file_id: '',
    attribute_type: '',
  };
  attributeId?: string;
  constructor(
    private uploadService : UploadService,
    private attributeService: AttributeService,
    private spinner: NgxSpinnerService,
    public toatsService: ToastService,
  ) { }

  ngOnInit() {
    this.getAttributes();
    
  }
  getAttributes() {
    this.typeModel = {
      type: ['PRODUCT_ATTRIBUTE']
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

  changeAttribute(e:Event){
    this.attribute.attribute_parent_id = e.toString();
  }

  async insertImage(): Promise<string | null> {
    this.uploadFile.type = 'PRODUCT_ATTRIBUTE';
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

  async insertattribute() {
    this.spinner.show();
    if (this.fileName) {
      const fileId = await this.insertImage();
      if (fileId) {
        this.attribute.file_id = fileId;
      }
    }
    this.attribute.attribute_type ='PRODUCT_attribute';
    this.attributeService.insertAttribute(this.attribute).subscribe({
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
        console.error('Error inserting attribute:', error);
      }
    });

  }

  getAttributeDetails(): void {
    let attribute = {
      attribute_id :this.attributeId,
       attribute_type: 'PRODUCT_ATTRIBUTE'
    }
    this.attributeService.getDetailAttribute(attribute).subscribe({
      next: (response) => {    
        if(response){
     this.uploadService.uploadImages(this.uploadFile).subscribe({
      next: (response) => {
        if(response.result_data.file_id){
         this.attribute.file_id = response.result_data.file_id;
         this.attribute.attribute_type ='PRODUCT_ATTRIBUTE';
         this.attributeService.insertAttribute(this.attribute).subscribe({
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
        // this.updatedattribute = { ...attribute };                        
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