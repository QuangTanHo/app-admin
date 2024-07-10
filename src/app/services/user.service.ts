import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpUtilService } from './http.util.service';
import { LoginModel } from '../models/login.model';
import { UserModel } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiLogin = `${environment.apiBaseUrl}un_auth/signin`;
    private apiUser= `${environment.apiBaseUrl}un_auth/user/`;

    private apiConfig = {
        headers: this.httpUtilService.createHeaders(),
    }

    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService
    ) { }

    // register(registerDTO: RegisterDTO): Observable<any> {
    //     return this.http.post(this.apiRegister, registerDTO, this.apiConfig);
    // }

    login(loginModel: LoginModel): Observable<any> {
        return this.http.post(this.apiLogin, loginModel, this.apiConfig);
    }
    getUserById(userId :string): Observable<UserModel> {
        return this.http.get<UserModel>(`${this.apiUser}${userId}`);
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

}