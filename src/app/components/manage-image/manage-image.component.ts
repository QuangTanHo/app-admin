import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastService } from '../../common/toast.service';
import { FileImageRequest, UploadFile } from '../../models/uploadFile';
import { SharedModule } from '../../modules/shared.module';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-manage-image',
  standalone: true,
  imports: [SharedModule,CommonModule],
  templateUrl: './manage-image.component.html',
  styleUrls: ['./manage-image.component.scss']
})
export class ManageImageComponent implements OnInit {
  imageListBanner: { src: string | ArrayBuffer | null, name: string, file_id?: string }[] = [];
  imageListSlide: { src: string | ArrayBuffer | null, name: string, file_id?: string }[] = [];
  listUploadFileImagesBanner: UploadFile[] = [];
  listUploadFileImagesSlide: UploadFile[] = [];
  @ViewChild('fileInputSetProduct') fileInputSetProduct!: ElementRef;
  @ViewChild('fileInputSetListBanner') fileInputSetListBanner!: ElementRef;
  @ViewChild('fileInputSetListSlide') fileInputSetListSlide!: ElementRef;


  constructor(
    private uploadService: UploadService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.handleGetListImageSlide();
    this.handleGetListImageBanner()
  }

  handleGetListImageSlide(){
    let request: FileImageRequest = {
      type:['SLIDE_IMAGE']
    }
    this.uploadService.getListImage(request).subscribe({
      next: (response: any) => {
        response.result_data.file_storage_info_list.forEach((file: any) => {
          this.getImageById(file.file_id).then((result) => {
            this.imageListSlide.push({ src: result, name: file.raw_file_name, file_id: file.file_id });
            console.log(this.imageListSlide);
          }).catch((error) => {
            console.error('Error fetching image:', error);
          });
        });
      },
      complete: () => {
      },
      error: (error: any) => {
        console.error('Error fetching Image:', error);
      }
    })
  }

  handleGetListImageBanner() {
    let request: FileImageRequest = {
      type: ['BANNER_IMAGE']
    }
    this.uploadService.getListImage(request).subscribe({
      next: (response: any) => {
        response.result_data.file_storage_info_list.forEach((file: any) => {
          this.getImageById(file.file_id).then((result) => {
            this.imageListBanner.push({ src: result, name: file.raw_file_name, file_id: file.file_id });
          }).catch((error) => {
            console.error('Error fetching image:', error);
          });
        });
      },
      complete: () => {
      },
      error: (error: any) => {
        console.error('Error fetching Image:', error);
      }
    })
  }

  getImageById(file_id: string): Promise<string | ArrayBuffer | null> {
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

  onDragOverListBanner(event: DragEvent) {
    event.preventDefault();
    // event.stopPropagation();
  }
  onDragLeaveListBanner(event: DragEvent) {
    event.preventDefault();
    // event.stopPropagation();
  }
  onDropListBanner(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.readFileListBanner(files);
    }
  }

  readFileListBanner(files: FileList) {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageListBanner.push({ src: reader.result, name: file.name });
      };
      reader.readAsDataURL(file);
    });
  }
  onDeleteClickListBanner(event: MouseEvent, index: number,id:any) {
    event.stopPropagation();
    this.imageListBanner.splice(index, 1);
    if (id) {
      this.uploadService.deleteFileById(id).subscribe({
        next: (response: any) => {
          this.toastService.showSuccess(response.result_msg);
        },
        complete: () => {
        },
        error: (error: any) => {
          console.error('Error fetching Image:', error);
        }
      })
    }
  }
  onAreaClickListBanner() {
    // this.fileInputSetListBanner.nativeElement.click();
    const fileInput = document.getElementById('fileInputSetListBanner') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelectedListBanner(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.readFilesListBanner(input.files);
    }
  }

  readFilesListBanner(files: FileList) {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageListBanner.push({ src: reader.result, name: file.name });
        let uploadFileImagesBanner: UploadFile = {
          file: file,
          file_name: file.name,
          description: '',
          file_directory: '/notification',
          doc_type_id: '',
          type: 'BANNER_IMAGE'
        };
        this.listUploadFileImagesBanner.push(uploadFileImagesBanner);
      };
      reader.readAsDataURL(file);
    });
  }

  //slide

  onDragOverListSlide(event: DragEvent) {
    event.preventDefault();
    // event.stopPropagation();
  }
  onDragLeaveListSlide(event: DragEvent) {
    event.preventDefault();
    // event.stopPropagation();
  }
  onDropListSlide(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.readFileListSlide(files);
    }
  }

  readFileListSlide(files: FileList) {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageListSlide.push({ src: reader.result, name: file.name });
      };
      reader.readAsDataURL(file);
    });
  }
  onDeleteClickListSlide(event: MouseEvent, index: number, id: any) {
    event.stopPropagation();
    this.imageListSlide.splice(index, 1);
    if(id){
      this.uploadService.deleteFileById(id).subscribe({
        next: (response: any) => {
          this.toastService.showSuccess(response.result_msg);
        },
        complete: () => {
        },
        error: (error: any) => {
          console.error('Error fetching Image:', error);
        }
      })
    }
  }
  onAreaClickListSlide() {
    // this.fileInputSetListSlide.nativeElement.click();
    const fileInput = document.getElementById('fileInputSetListSlide') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelectedListSlide(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.readFilesListSlide(input.files);
    }
  }

  readFilesListSlide(files: FileList) {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageListSlide.push({ src: reader.result, name: file.name });
        let uploadFileImagesSlide: UploadFile = {
          file: file,
          file_name: file.name,
          description: '',
          file_directory: '/notification',
          doc_type_id: '',
          type: 'SLIDE_IMAGE'
        };
        this.listUploadFileImagesSlide.push(uploadFileImagesSlide);
      };
      reader.readAsDataURL(file);
    });



  }

  public handleSaveListImageBanner(){
    this.listUploadFileImagesBanner.forEach((item)=>{
      this.uploadService.uploadImages(item).subscribe({
        next: (response: any) => {
          this.toastService.showSuccess(response.result_msg);
        },
        complete: () => {
        },
        error: (error: any) => {
          console.error('Error fetching categories:', error);
        }
      })
    })

  }

  public handleSaveListImageSlide() {
    this.listUploadFileImagesSlide.forEach((item) => {
      this.uploadService.uploadImages(item).subscribe({
        next: (response: any) => {
          this.toastService.showSuccess(response.result_msg);
        },
        complete: () => {
        },
        error: (error: any) => {
          console.error('Error fetching categories:', error);
        }
      })
    })

  }

}
