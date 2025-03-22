// import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { TokenService } from "../services/token.service";
// import { HttpUtilService } from "../services/http.util.service";
// import { Observable, throwError } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';
// import { UserService } from "../services/user.service";

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor{
//   private isRefreshing = false;
//     constructor(private tokenService: TokenService, 
//       private userService: UserService
//     ) { }

//     // intercept(
//     //     req: HttpRequest<any>,
//     //     next: HttpHandler): Observable<HttpEvent<any>> {        
//     //     debugger    
//     //     const token = this.tokenService.getToken();
//     //     if (token) {
//     //         req = req.clone({
//     //             setHeaders: {
//     //                 Authorization: `Bearer ${token}`,
//     //             },
//     //         });
//     //     }
//     //     return next.handle(req);
//     // }

//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//       debugger
//         const accessToken = this.tokenService.getToken();
    
//         let authReq = req;
//         if (accessToken) {
//           this.addTokenHeader(req, accessToken);
//         }
    
//         return next.handle(authReq).pipe(
//           catchError((error) => {
//             if (error instanceof HttpErrorResponse && error.status === 401 && !this.isRefreshing) {
//               return this.handle401Error(req, next);
//             }
    
//             return throwError(() => error);
//           })
//         );
//       }

//       private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
//         debugger
//         this.isRefreshing = true;
//         const refreshToken = this.tokenService.getRefreshToken();
//         if (refreshToken) {
//           return this.userService.refeshToken(refreshToken).pipe(
//             switchMap((token: any) => {
//               this.isRefreshing = false;
//               this.tokenService.setToken(token.token);
//               this.tokenService.setRefreshTokens( token.refreshToken);
//               return next.handle(this.addTokenHeader(request, token.accessToken));
//             }),
//             catchError((err) => {
//               this.isRefreshing = false;
//               return throwError(() => err);
//             })
//           );
//         }
//         return throwError(() => 'No refresh token available');
//       }

//       private addTokenHeader(request: HttpRequest<any>, token: string) {
//         return request.clone({
//           headers: request.headers.set('Authorization', `Bearer ${token}`)
//         });
//       }
// }

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslationService } from '../common/translation.service';

export const TokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const tokenService = inject(TokenService);
  const userService = inject(UserService);
  const translationService = inject(TranslationService);  // Inject TranslationService
  let isRefreshing = false;

  // Danh sách các URL và phương thức không cần token
  const noAuthUrls = [
    { url: '/login', method: 'POST' },
    { url: '/register', method: 'POST' } // ví dụ GET không cần token
  ];

  // Lấy ngôn ngữ hiện tại từ TranslationService
  let currentLanguage = 'en';  // Giá trị mặc định
  translationService.currentLanguage$.subscribe(lang => {
    currentLanguage = lang;
  });

  // Kiểm tra nếu URL và phương thức không cần token
  const isNoAuthUrl = noAuthUrls.some(item => req.url.includes(item.url) && req.method === item.method);

  let authReq = req;
  if (!isNoAuthUrl) {
    const accessToken = tokenService.getToken();

    if (accessToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': currentLanguage,  // Thêm Accept-Language vào request
        },
      });
    }
  } else {
    // Nếu là URL không cần token, chỉ thêm Accept-Language
    authReq = req.clone({
      setHeaders: {
        'Accept-Language': currentLanguage,
      }
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !isRefreshing) {
        isRefreshing = true;
        const refreshToken = tokenService.getRefreshToken();

        if (refreshToken) {
          return userService.refeshToken(refreshToken).pipe(
            switchMap((token: any) => {
              tokenService.setToken(token.token);
              tokenService.setRefreshTokens(token.refreshToken);
              return next(authReq.clone({
                setHeaders: {
                  Authorization: `Bearer ${token.accessToken}`,
                  'Accept-Language': currentLanguage,  // Thêm Accept-Language sau khi làm mới token
                },
              }));
            }),
            catchError((err) => {
              isRefreshing = false;
              return throwError(() => err);
            })
          );
        }
        return throwError(() => 'No refresh token available');
      }
      return throwError(() => error);
    })
  );
};
