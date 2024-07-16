import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../modules/shared.module';
import { CommonModule } from '@angular/common';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { UploadService } from '../../../services/upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ArticleService } from '../../../services/article.service';
import { ToastService } from '../../../common/toast.service';
import { UploadFile } from '../../../models/uploadFile';
import { Article } from '../../../models/article';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-article',
  standalone: true,
  imports: [SharedModule,CommonModule,AngularEditorModule],
  templateUrl: './update-article.component.html',
  styleUrls: ['./update-article.component.scss']
})
export class UpdateArticleComponent implements OnInit {
  image: { src: string | ArrayBuffer | null, fileId: string, name: string } = { src: null, fileId: '', name: '' };
  @ViewChild('fileInputSetProduct') fileInputSetProduct!: ElementRef;
  htmlContent = '';

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
    category_id: []=[],
}
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
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
  articleId : any
  constructor(
    private uploadService: UploadService,
    private spinner: NgxSpinnerService,
    private articleService : ArticleService,
    private toatsService : ToastService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.articleId = params.get('id') as string;
    });
    if(this.articleId){
        this.getListArticleId();
    }
  }
  getListArticleId(){
    this.articleService.getByIdArticle(this.articleId).subscribe({
      next: (response) => {
        if(response.result_data){
        if (response.result_code === 1) {
          this.articleDTo.image  = response.result_data.image;
          if(this.articleDTo.image){
            this.getImagebById();
          }
          this.articleDTo.article_id  = response.result_data.article_id;
          this.htmlContent =response.result_data.content;
          this.articleDTo.content =response.result_data.content;
          this.articleDTo.status =  response.result_data.status;
          this.articleDTo.slug=  response.result_data.slug;
          this.articleDTo.article_name=  response.result_data.article_name;
          this.articleDTo.category_id=  response.result_data.article_category_list;
        }
        }
      },
      error: (error) => {
        console.error('Error get Article:', error);
      }
    });    
    
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

  async updateArticle() {    
      this.spinner.show();
      if (this.uploadFile.file) {
        const fileId = await this.insertImage(this.uploadFile);
        if (fileId) {
          this.articleDTo.image = fileId;
        }
      }       
      this.user = localStorage.getItem('user');
     let user1 = JSON.parse(this.user);
     this.articleDTo.user_id = user1.userId;
     debugger
      this.articleService.updateArticle(this.articleDTo).subscribe({
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
          this.spinner.hide();
          alert(error.error)
          console.error('Error inserting Article:', error);
        }
      });    
    }
    getImagebById(){
      this.uploadService.getInforFileById( this.articleDTo.image).subscribe({
        next: (res) => {
          if(res){
            this.uploadService.getOriginalImage( this.articleDTo.image).subscribe({
                next: (imageBlob) => {
                  if(imageBlob){
                    const reader = new FileReader();
                    reader.onload = () => {
                      this.image.src = reader.result;
                      this.image.fileId = this.articleDTo.image;
                      this.image.name = res.result_data.raw_file_name;
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
}
