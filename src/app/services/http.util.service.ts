import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { TranslationService } from '../common/translation.service';

@Injectable({
    providedIn: 'root',
})
export class HttpUtilService {
    private currentLanguage: string = 'en';  // Giá trị mặc định
    constructor(private translationService: TranslationService) {
        // Subscribe để theo dõi ngôn ngữ thay đổi
        this.translationService.currentLanguage$.subscribe(lang => {
          this.currentLanguage = lang;
        });
      }
    createHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept-Language':this.currentLanguage,

        });
    }    
    createHeadersToken(token:string): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept-Language':this.currentLanguage,
             Authorization: `Bearer ${token}`

        });
    } 

}