import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiGetOrders  = `${environment.apiBaseUrl}orders`;

  constructor(private http: HttpClient) { }

  getListPageOrder(data:any):Observable<any> {
    return  this.http.post(this.apiGetOrders.concat('/get-order-page'), data);
  }

  getListOrderDetail(orderId:string):Observable<any> {
    return  this.http.get(this.apiGetOrders.concat('/get-order-detail/').concat(orderId));
  }

  delteOrder(orderId:string):Observable<any> {
    return  this.http.put(this.apiGetOrders.concat('/delete'), orderId);
  }

}
