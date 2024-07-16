import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../modules/shared.module';
import { UploadService } from '../../../services/upload.service';
import { AttributeService } from '../../../services/attribute.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../common/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TypeModel } from '../../../models/type.model';
import { UploadFile } from '../../../models/uploadFile';

@Component({
  selector: 'app-update-attribute',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './update-attribute.component.html',
  styleUrls: ['./update-attribute.component.scss']
})
export class UpdateAttributeComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  attributeId?: string;
  image: { src: string | ArrayBuffer | null, fileId: string, name: string } = { src: null, fileId: '', name: '' };
  file: File | null = null; // Declare file as a global variable
  fileName: string = '';
  attribute?: any;
  typeModel? :TypeModel;
  attributes: any; 
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
    private attributeService: AttributeService,
    private route: ActivatedRoute,
    public toatsService: ToastService, 
    private spinner: NgxSpinnerService,) { }

  ngOnInit() {
    this.getAttributes();
    this.route.paramMap.subscribe(params => {
      this.attributeId = params.get('id') as string;
    });
    if(this.attributeId){
     this.getAttributeDetails();
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
    this.attribute.file_id='';

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
  changeattribute(e:Event){
    this.attribute.attribute_parent_id = e.toString();
  }

  getAttributes() {
    this.typeModel = {
      type: ['PRODUCT_attribute']
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

  getAttributeDetails(): void {
    let attribute = {
      attribute_id :this.attributeId,
      attribute_type: 'PRODUCT_attribute'
    }
    this.attributeService.getDetailAttribute(attribute).subscribe({
      next: (response : any) => { 
        if(response){
        this.attribute = response.result_data;
        this.attribute.attribute_parent_id = response.result_data?.attribute_parent_id[0].attribute_id;
        if(this.attribute.file_id){
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
  this.uploadService.getInforFileById(this.attribute.file_id).subscribe({
    next: (res) => {
      if(res){
        this.fileName = res.result_data.raw_file_name ;
        this.uploadService.getOriginalImage(this.attribute.file_id).subscribe({
            next: (imageBlob) => {
              if(imageBlob){
                const reader = new FileReader();
                reader.onload = () => {
                  this.image.src = reader.result;
                  this.image.fileId = this.attribute.file_id;
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
  this.uploadFile.type = 'attribute_IMAGE';
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

async  updateattribute() {
  this.spinner.show();
  if (this.fileName) {
    const fileId = await this.updateImage();
    if (fileId) {
      this.attribute.file_id = fileId;
    }
  }
  this.attribute.attribute_type ='PRODUCT_attribute';
  this.attributeService.updateAttribute(this.attribute).subscribe({
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
}
