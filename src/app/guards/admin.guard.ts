import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn } from '@angular/router';
import { Router } from '@angular/router'; // Đảm bảo bạn đã import Router ở đây.
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { TokenService } from '../services/token.service';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  userResponse:any;
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private userService: UserService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.getUserId() ? true : false;
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    const isAdmin = this.userResponse?.role.id == '1' ||  this.userResponse?.role.id  == '2' ;
    if (!isTokenExpired && isUserIdValid && isAdmin) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

export const AdminGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(AdminGuard).canActivate(next, state);
}
