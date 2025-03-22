import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { UserModel } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  token: string = "";

  user?:any;



  constructor(
    private router: Router,
    private userService: UserService
   
  ) { 
   
  }

  isAuthenticated(){
    this.token = localStorage.getItem(this.TOKEN_KEY) ?? "";
    if(this.token === ""){
      this.router.navigateByUrl("/login");
      return false;
    }

    const decode: JwtPayload | any = jwtDecode(this.token);
    const exp = decode.exp;
    const now = new Date().getTime() / 1000;

    if(now > exp){
      this.router.navigateByUrl("/login");
      return false;
    }
    this.user =  new UserModel()
    this.user.userId = decode["Id"];
    this.user.lastName = decode["Name"];
    this.user.email = decode["Email"];

    return true;
  }

  hasRole(roleId: string): boolean {
    this.user = this.userService.getUserResponseFromLocalStorage();
    return this.user.role.id.toString() === roleId;
  }

 
}