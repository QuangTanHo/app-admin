import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TypeModel } from '../models/type.model';
import { HttpUtilService } from './http.util.service';
import { Attribute } from '../models/attribute';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  private apiBaseUrl = environment.apiBaseUrl;
  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  }
  private token = localStorage.getItem('access_token') ?? '';;

  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }
  getAttribute(type :TypeModel): Observable<Attribute[]> {
    return this.http.post<Attribute[]>(`${environment.apiBaseUrl}un_auth/attribute/get_info_attribute_type`, type);
  }
  getDetailAttribute(attribute: any): Observable<Attribute> {
    return this.http.post<Attribute>(`${this.apiBaseUrl}un_auth/attribute/attribute_detail`,attribute);
  }
  deleteAttribute(attribute_id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiBaseUrl}admin/attribute/delete/${attribute_id}`,{
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
      })
    })
  }
  insertAttribute(attribute: Attribute): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}un_auth/attribute/attribute_create`, attribute,this.apiConfig);
  }
  
  updateAttribute(attribute: Attribute): Observable<any> {
    return this.http.post<Attribute>(`${this.apiBaseUrl}un_auth/attribute/attribute_update`, attribute);
  }
}
