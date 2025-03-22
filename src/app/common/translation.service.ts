import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  // Quản lý các bản dịch và ngôn ngữ hiện tại
  private translations = new BehaviorSubject<any>({});
  private language = new BehaviorSubject<string>('en');

  // Các observable để component khác có thể subscribe
  currentTranslations$ = this.translations.asObservable();
  currentLanguage$ = this.language.asObservable();

  constructor(private http: HttpClient) {
    this.loadTranslations('en'); // Ngôn ngữ mặc định
  }

  // Load bản dịch từ file JSON
  loadTranslations(lang: string): void {
    this.http.get(`assets/i18n/${lang}.json`).subscribe((data: any) => {
      this.translations.next(data); // Cập nhật toàn bộ bản dịch
      this.language.next(lang);     // Thông báo ngôn ngữ thay đổi
    });
  }

  // Hàm trả về bản dịch cho một key cụ thể
  getTranslation(key: string): string {
    const currentTranslations = this.translations.getValue(); // Lấy bản dịch hiện tại
    return currentTranslations[key] || key; // Trả về bản dịch, hoặc key nếu không tìm thấy
  }

  // Chuyển đổi ngôn ngữ
  switchLanguage(lang: string): void {
    this.loadTranslations(lang); // Gọi hàm load bản dịch cho ngôn ngữ mới
  }
}
