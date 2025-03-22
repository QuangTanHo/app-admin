import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiGetRoles  = `${environment.apiBaseUrl}un_auth/products/product_list`;
  private apiGetOrders  = `${environment.apiBaseUrl}orders`;

  constructor(private http: HttpClient) { }

  getAllProducts():Observable<any> {
    return this.http.get<any[]>(this.apiGetRoles);
  }
  createdOrders(data:any):Observable<any> {
    return  this.http.post(this.apiGetOrders, data);
  }

}
