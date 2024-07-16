import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilService } from './http.util.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Article } from '../models/article';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

private apiBaseUrl = environment.apiBaseUrl;
private apiConfig = {
  headers: this.httpUtilService.createHeaders(),
}
private token = localStorage.getItem('access_token') ?? '';

constructor(private http: HttpClient,
  private httpUtilService: HttpUtilService
) { }

getAllArticle(model:any): Observable<any> {
  return this.http.post<any>(`${environment.apiBaseUrl}un_auth/article/get_all_article`, model);
}
getDetailArticle(category: any): Observable<any> {
  return this.http.post<any>(`${this.apiBaseUrl}un_auth/category/category_detail`,category);
}
deleteArticle(article_id: string): Observable<string> {
  return this.http.delete<string>(`${this.apiBaseUrl}admin/article/delete/${article_id}`,{
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
    })
  })
}
insertArticle(article: any): Observable<any> {
  return this.http.post(`${this.apiBaseUrl}admin/article/create`, article,{
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
    })
  })
}
getByIdArticle(article_id: string): Observable<any> {
  return this.http.get<any>(`${environment.apiBaseUrl}un_auth/article/${article_id}`);
}

updateArticle(article: any): Observable<any> {
  return this.http.post<any>(`${this.apiBaseUrl}admin/article/article_update`,article,{
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
    })
  })
}
}
