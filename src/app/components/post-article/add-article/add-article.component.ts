import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../modules/shared.module';
import { CommonModule } from '@angular/common';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { UploadFile } from '../../../models/uploadFile';
import { UploadService } from '../../../services/upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ArticleService } from '../../../services/article.service';
import { Article } from '../../../models/article';
import { ToastService } from '../../../common/toast.service';

@Component({
  selector: 'app-add-article',
  standalone: true,
  imports: [SharedModule,CommonModule,AngularEditorModule],
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.scss']
})
export class AddArticleComponent implements OnInit {
  image: { src: string | ArrayBuffer | null, fileId: string, name: string } = { src: null, fileId: '', name: '' };
  @ViewChild('fileInputSetProduct') fileInputSetProduct!: ElementRef;
  htmlContent = 'uututu';

  uploadFile: UploadFile = {
    file: null, 
    file_name: '',
    description: '',
    file_directory: '/notification',
    doc_type_id: '',
    type: 'ARTICLE_IMAGE'
  }
  user : any
  articleDTo : Article ={
    image:'',
    article_id:'',
    article_name: '',
    content: this.htmlContent,
    user_id:'',
    slug: '',
    status: '',
    category_id: []
}
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '300px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'http://your-server-url/upload-image', // Replace with your API endpoint for image upload
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['insertImage'],
      ['insertVideo'],
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  constructor(
    private uploadService: UploadService,
    private spinner: NgxSpinnerService,
    private articleService : ArticleService,
    private toatsService : ToastService
  ) { }

  ngOnInit() {
  }
  onDragOverSetProduct(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeaveSetProduct(event: DragEvent) {
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

  onAreaClickSetProduct() {
    this.fileInputSetProduct.nativeElement.click();
  }
  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.image.src= reader.result;
      this.image.name= file.name
    };
    reader.readAsDataURL(file);
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
          this.uploadFile.file_name=file.name;
          this.uploadFile.type='ARTICLE_IMAGE';
        }
      };
  
      reader.readAsDataURL(file);
    }
  }

  onDeleteClickSetProduct(event: MouseEvent) {
    event.stopPropagation();
    this.image.src = null;
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

  async insertArticle() {    
      this.spinner.show();
      if (this.image.src) {
        const fileId = await this.insertImage(this.uploadFile);
        if (fileId) {
          this.articleDTo.image = fileId;
        }
      }       
      this.user = localStorage.getItem('user');
     let user1 = JSON.parse(this.user);
     this.articleDTo.user_id = user1.userId;
      this.articleService.insertArticle(this.articleDTo).subscribe({
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
          console.error('Error inserting Article:', error);
        }
      });    
    }
}
