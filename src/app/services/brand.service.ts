import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Brand } from '../models/brand';
import { TypeModel } from '../models/type.model';
import { HttpUtilService } from './http.util.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private apiBaseUrl = environment.apiBaseUrl;
  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  }
  private token = localStorage.getItem('access_token') ?? '';;

  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${environment.apiBaseUrl}un-auth/brand/getAll`);
  }
  getListBrands(objSearch :any): Observable<Brand[]> {
    return this.http.post<Brand[]>(`${environment.apiBaseUrl}un-auth/brand/get-list-brand`,objSearch);
  }
  getBrandById(brandId: any): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiBaseUrl}un-auth/brand/${brandId}`);
  }
  deleteBrand(brandId: string): Observable<string> {
    return this.http.delete<string>(`${this.apiBaseUrl}admin/brand/delete/${brandId}`,{
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
      })
    })
  }
  insertBrand(Brand: Brand): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}un-auth/brand/save`, Brand,this.apiConfig);
  }
  
  updateBrand(brand: Brand): Observable<any> {
    return this.http.put<Brand>(`${this.apiBaseUrl}un-auth/brand/update`, brand);
  }
}
