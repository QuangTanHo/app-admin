import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category';
import { TypeModel } from '../models/type.model';
import { HttpUtilService } from './http.util.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiBaseUrl = environment.apiBaseUrl;
  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  }
  private token = localStorage.getItem('access_token') ?? '';;

  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }
  getCategories(type :TypeModel): Observable<Category[]> {
    return this.http.post<Category[]>(`${environment.apiBaseUrl}un_auth/category/get-info-category-type`, type);
  }
  getDetailCategory(category: any): Observable<Category> {
    return this.http.post<Category>(`${this.apiBaseUrl}un_auth/category/category_detail`,category);
  }
  deleteCategory(category_id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiBaseUrl}admin/category/delete/${category_id}`,{
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
      })
    })
  }
  insertCategory(category: Category): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}un_auth/category/category_create`, category,this.apiConfig);
  }
  
  updateCategory(category: Category): Observable<any> {
    return this.http.post<Category>(`${this.apiBaseUrl}un_auth/category/category_update`, category);
  }
}
