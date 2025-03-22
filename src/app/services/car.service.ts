import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Brand } from '../models/brand';
import { TypeModel } from '../models/type.model';
import { HttpUtilService } from './http.util.service';
import { Product } from '../models/product';
import { ProductDTO } from '../models/modelDTO/productDTO';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private apiBaseUrl = environment.apiBaseUrl;
  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
}
private token = localStorage.getItem('access_token') ?? '';;

  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }
  getCar(car :any): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl}un-auth/car/get-list-car`, car);
  }

  deleteProduct(productId: string): Observable<string> {
    return this.http.delete<string>(`${this.apiBaseUrl}admin/product/delete/${productId}`,{
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
      })
    })
  }
  getProductById(productId: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}un_auth/product/${productId}`);
  }
 
  insertProduct(product: Product): Observable<any> {
    // Add a new category
    return this.http.post(`${this.apiBaseUrl}admin/product/create`, product,{
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
      })
    })
  }

   updateProduct(model :any): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}admin/product/product-update`, model,{
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
      })
    } );
  }
}
