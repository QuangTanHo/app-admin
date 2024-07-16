import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { NgxSpinnerService } from 'ngx-spinner';
import { UploadFile } from '../../models/uploadFile';
import { UploadService } from '../../services/upload.service';
import { Product } from '../../models/product';
import { Article } from '../../models/article';
import { ToastService } from '../../common/toast.service';
import { ArticleService } from '../../services/article.service';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../common/pagination/pagination.component';

@Component({
  selector: 'app-post-article',
  standalone: true,
  imports: [SharedModule,CommonModule,AngularEditorModule, PaginationComponent],
  templateUrl: './post-article.component.html',
  styleUrls: ['./post-article.component.scss']
})
export class PostArticleComponent implements OnInit {
  htmlContent = '';
  image: { src: string | ArrayBuffer | null, fileId: string, name: string } = { src: null, fileId: '', name: '' };
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

  articleResponse : any;
  totalRecords = 0;

  articleModel ={
    article_name: '',
    status: '',
    page_number: 1,
    page_size: 10,
    sort_by: '',
    sort_direction: 'desc'
  }
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    public toatsService: ToastService, 
    public articleService : ArticleService
  ) { }

  ngOnInit() {
    this.getAllListArticle(this.articleModel.page_number,this.articleModel.page_size  );
  }


getAllListArticle(page : number ,size :number) {
  this.articleModel.page_number= page;
  this.articleModel.page_size = size;
  this.articleService.getAllArticle(this.articleModel).subscribe({
    next: (response) => {
      if(response.result_data){
        this.spinner.hide();
      if (response.result_code === 1) {
        this.articleResponse  = response.result_data.list_article;
        this.totalRecords = response.result_data.total_records;
      }
      }
    },
    error: (error) => {
      console.error('Error get Article:', error);
    }
  });    
}

updateArticle(article_id : any){
  this.router.navigate(['/update-article',article_id]);
}
deleteArticle(article_id : any){
  const confirmation = window
      .confirm('Are you sure you want to delete this c?');
    if (confirmation) {
      this.articleService.deleteArticle(article_id).subscribe({
        next: (response: string) => {
          location.reload();
        },
        complete: () => {
        },
        error: (error: any) => {
          alert(error.error)
          console.error('Error fetching Product:', error);
        }
      });
    }
  }
  
insertArticle(){
  this.router.navigate(['/add-article']);
}
search(){
  this.getAllListArticle(1, this.articleModel.page_size);
}
onPageChanged(page: number): void {
  this.getAllListArticle(page, this.articleModel.page_size);
}

}
 

  
