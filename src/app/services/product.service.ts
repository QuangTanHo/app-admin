import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category';
import { TypeModel } from '../models/type.model';
import { HttpUtilService } from './http.util.service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiBaseUrl = environment.apiBaseUrl;
  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
}

  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }
  // getProduct(type :TypeModel): Observable<Category[]> {
  //   return this.http.post<Category[]>(`${environment.apiBaseUrl}un_auth/category/get-info-category-type`, type);
  // }
  // getDetailCategory(category: any): Observable<Category> {
  //   return this.http.post<Category>(`${this.apiBaseUrl}un_auth/category/category_detail`,category);
  // }
  // deleteCategory(category_id: string): Observable<string> {
  //   return this.http.delete<string>(`${this.apiBaseUrl}admin/category/delete/${category_id}`);
  // }
  // // updateCategory(id: number, updatedCategory: UpdateCategoryDTO): Observable<UpdateCategoryDTO> {
  // //   return this.http.put<Category>(`${this.apiBaseUrl}/Product/${id}`, updatedCategory);
  // // }
  inseProduct(product: Product): Observable<any> {
    // Add a new category
    return this.http.post(`${this.apiBaseUrl}admin/product/create`, product,this.apiConfig);
  }
}
