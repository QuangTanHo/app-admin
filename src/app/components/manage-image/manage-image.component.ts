import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UploadFile } from '../../models/uploadFile';
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
  imageSrcSetProduct: string | ArrayBuffer | null = null;
  imageListBanner: { src: string | ArrayBuffer | null, name: string }[] = [];
  imageListSlide: { src: string | ArrayBuffer | null, name: string }[] = [];
  fileName: string = '';
  uploadFile: UploadFile = {
    file: null,
    file_name: '',
    description: '',
    file_directory: '/notification',
    doc_type_id: '',
    type: ''
  }

  @ViewChild('fileInputSetProduct') fileInputSetProduct!: ElementRef;
  @ViewChild('fileInputSetListBanner') fileInputSetListBanner!: ElementRef;
  @ViewChild('fileInputSetListSlide') fileInputSetListSlide!: ElementRef;


  constructor(
    private uploadService: UploadService
  ) { }

  ngOnInit() {
  }

  onDragOverListBanner(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
  onDragLeaveListBanner(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
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
  onDeleteClickListBanner(event: MouseEvent, index: number) {
    event.stopPropagation();
    this.imageListBanner.splice(index, 1);
  }
  onAreaClickListBanner() {
    this.fileInputSetListBanner.nativeElement.click();
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
      };
      reader.readAsDataURL(file);
    });
  }

  //slide

  onDragOverListSlide(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
  onDragLeaveListSlide(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
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
  onDeleteClickListSlide(event: MouseEvent, index: number) {
    event.stopPropagation();
    this.imageListSlide.splice(index, 1);
  }
  onAreaClickListSlide() {
    this.fileInputSetListSlide.nativeElement.click();
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
      };
      reader.readAsDataURL(file);
    });
  }
}
