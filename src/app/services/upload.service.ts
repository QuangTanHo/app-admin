import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FileImageRequest, UploadFile } from '../models/uploadFile';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadImages(upload: UploadFile): Observable<any> {
    const formData = new FormData();
    formData.append('file', upload.file as Blob);
    formData.append('file_name', upload.file_name);
    formData.append('description', upload.description);
    formData.append('file_directory', upload.file_directory);
    formData.append('doc_type_id', upload.doc_type_id);
    formData.append('type', upload.type);
    return this.http.post<UploadFile[]>(`${environment.apiBaseUrl}un_auth/files/upload_file`, formData);
  }

  getListImage(file: FileImageRequest): Observable<UploadFile[]> {
    const url = `${environment.apiBaseUrl}un_auth/files/get_info_file_type`;

    return this.http.post<UploadFile[]>(url, file);
  }

  getOriginalImage(fileId: string): Observable<Blob> {
    const url = `${environment.apiBaseUrl}un_auth/files/download/original/${fileId}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getInforFileById(fileId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}un_auth/files/get_info_file_storage/${fileId}`);
  }

  deleteFileById(fileId: string): Observable<string> {
    return this.http.delete<string>(`${environment.apiBaseUrl}un_auth/files/delete/${fileId}`);
  }
}
