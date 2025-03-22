import { Component, OnInit } from '@angular/core';
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
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../../services/authConfig/auth.config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule ],
  providers: [OAuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']  
})
export class LoginComponent implements OnInit {
  model: LoginModel = new LoginModel();
  
  rememberMe: boolean = true;
  userModel?: UserModel;
  userResponse?: any;
  roles:any;
  selectedRole:any

  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private spinner: NgxSpinnerService,
    private roleService: RoleService,
     private _oauthService: OAuthService
  ) {
    this._oauthService.configure(authConfig);
    // this._oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  ngOnInit() {
    // Gọi API lấy danh sách roles và lưu vào biến roles
    // debugger
    // this.roleService.getRoles().subscribe({      
    //   next: (roles:any) => { // Sử dụng kiểu Role[]
    //     this.roles = roles;
    //     this.selectedRole = roles.length > 0 ? roles[0] : undefined;
    //   },
    //   complete: () => {
    //     debugger
    //   },  
    //   error: (error: any) => {
    //     debugger
    //     console.error('Error getting roles:', error);
    //   }
    // });
    // this._oauthService.configure(authConfig);
    // this._oauthService.setupAutomaticSilentRefresh();
    // this._oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
    //   console.log('Discovery document loaded successfully');
    // });
  }

  signIn() {
    this.model.email = 'johndoe@example.com';
    this.model.password = 'securePassword123';
    this.spinner.show();
    this.userService.login(this.model).subscribe({
      next: (response: ResultModel<LoginResponseModel>) => {
        const token = response.data?.token as string;
        const refeshToken = response.data?.refresh_token as string
        if (this.rememberMe) {
          this.tokenService.setToken(token);
          this.tokenService.setRefreshTokens(refeshToken);
          this.userService.getUserDetail(token).subscribe({
            next: (response: any) => {
              this.userResponse = {
                ...response.data,
                date_of_birth: new Date(response.data.date_of_birth),
              };    
              this.userService.saveUserResponseToLocalStorage(this.userResponse); 
              if(this.userResponse?.role.name === 'ADMIN' || this.userResponse?.role.name === 'SUPPER_ADMIN' ) {
                // this.router.navigate(['/']);
                this.router.navigate(['/'], { replaceUrl: true });
              } else if(this.userResponse?.role.name === 'USER') {
                this.router.navigate(['/login']);
              }
            },
            complete: () => {
              this.spinner.hide();  // Hide spinner when the request is complete
            },
            error: (error: any) => {
              this.spinner.hide();
              alert(error.error.message);
            }
          });
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        alert(error.error.message);
      }
    });
  }
  loginWithGoogle() {
    this._oauthService.initLoginFlow();
  }

}
