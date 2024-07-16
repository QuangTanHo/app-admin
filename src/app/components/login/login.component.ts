import { Component } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { LoginModel } from '../../models/login.model';
import { HttpService } from '../../services/http.service';
import { LoginResponseModel } from '../../models/login.response.model';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { ResultModel } from '../../models/result.model';
import { UserModel } from '../../models/user.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  model: LoginModel = new LoginModel();
  
  rememberMe: boolean = true;
  userModel?: UserModel
 
  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private spinner: NgxSpinnerService
  ){}

  signIn() {
    // this.model.email = 'quangtan1197@gmail.com'
    // this.model.password = '123456'
    this.spinner.show();
    this.userService.login(this.model).subscribe({
      next: (response: ResultModel<LoginResponseModel>) => {
        const token = response.result_data?.token as string;
        const userId = response.result_data?.userId as string;
        if (this.rememberMe) {
          this.tokenService.setToken(token);
          this.userService.getUserById(userId).subscribe({
            next: (response: any) => {
              this.spinner.hide();
              this.userModel = response.result_data;
              this.userService.saveUserResponseToLocalStorage(this.userModel);
              if (this.userModel?.roleId == '1') {
                this.router.navigate(['/']).then(() => {
                  window.location.reload();
                });
              } else if (this.userModel?.roleId == '2') {
                this.router.navigate(['/login']);
              }

            },
            complete: () => {
            },
            error: (error: any) => {
              this.spinner.hide();
              alert(error.error.message);
            }
          });
        }
      },
      complete: () => {
      },
      error: (error: any) => {
        this.spinner.hide();
        alert(error.error.message);
      }
    });
  }
}
  
