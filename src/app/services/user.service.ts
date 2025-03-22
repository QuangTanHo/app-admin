import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginModel } from '../models/login.model';
import { Register, UserModel, UserResponse } from '../models/user.model';
import { HttpUtilService } from './http.util.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiBaseUrl = environment.apiBaseUrl;
    private apiLogin = `${environment.apiBaseUrl}login`;
    private apiRegister = `${environment.apiBaseUrl}register`;
    private apiUser = `${environment.apiBaseUrl}users`;
    private apiUserAll = `${environment.apiBaseUrl}users/get-all-users`;
    private apiUserDetail = `${environment.apiBaseUrl}auth/details`;
    private apiRefreshToken = `${environment.apiBaseUrl}/refreshToken`;
    private token = localStorage.getItem('access_token') ?? '';

    // private apiConfig = {
    //     headers: this.httpUtilService.createHeaders(),
    // }
    private apiConfigToken = {
        headers: this.httpUtilService.createHeadersToken(this.token),
    }

    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService,
    ) { }

    getListUser(params: any): Observable<UserResponse[]> {
        return this.http.post<UserResponse[]>(`${this.apiUser}`,params);
    }
    getListAllUser(): Observable<UserResponse[]> {
        return this.http.get<UserResponse[]>(`${this.apiUserAll}`);
    }

    UserDetail(userId: any): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.apiUser}/${userId}`);
    }

    deleteUser(userId: string): Observable<string> {
        return this.http.delete<string>(`${this.apiBaseUrl}admin/user/delete/${userId}`,  {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            })
        })
    }

    login(loginModel: LoginModel): Observable<any> {
        return this.http.post(this.apiLogin, loginModel);
    }

    register(loginModel: LoginModel): Observable<any> {

            const a =  {
                "fullname": "John Doe",
                "email": "johndoe@example.com",
                "phone_number": "1234567890",
                "address": "123 Main St, Springfield",
                "shopName":"1222",
                "password": "securePassword123",
                "retype_password": "securePassword123",
                "date_of_birth": "1990-05-20",
                "facebook_account_id": 0,
                "google_account_id": 0,
                "role_id": 3
              }
        return this.http.post(this.apiRegister, a);
    }

    getUserById(userId: string): Observable<UserModel> {
        return this.http.get<UserModel>(`${this.apiUser}/${userId}`);
    }

    updateUser(user: UserResponse): Observable<any> {
        return this.http.post<UserResponse>(`${this.apiUser}/update`, user);
    }
    saveUserResponseToLocalStorage(userResponse?: UserModel) {
        try {
            if (userResponse == null || !userResponse) {
                return;
            }
            const userResponseJSON = JSON.stringify(userResponse);
            localStorage.setItem('user', userResponseJSON);
            console.log('User response saved to local storage.');
        } catch (error) {
            console.error('Error saving user response to local storage:', error);
        }
    }
    getUserResponseFromLocalStorage(): UserModel | null {
        try {
            const userResponseJSON = localStorage.getItem('user');
            if (userResponseJSON == null || userResponseJSON == undefined) {
                return null;
            }
            const userResponse = JSON.parse(userResponseJSON!);
            console.log('User response retrieved from local storage.');
            return userResponse;
        } catch (error) {
            console.error('Error retrieving user response from local storage:', error);
            return null;
        }
    }
    removeUserFromLocalStorage(): void {
        try {
            localStorage.removeItem('user');
            console.log('User data removed from local storage.');
        } catch (error) {
            console.error('Error removing user data from local storage:', error);
        }
    }

    getUserDetail(token: string) {
        return this.http.post(this.apiUserDetail,{}, {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`
              })
            });
      }

    refeshToken(refreshToken :any): Observable<any> {
        return this.http.post<UserResponse>(`${this.apiRefreshToken}`, {refreshToken} );
    }

}
