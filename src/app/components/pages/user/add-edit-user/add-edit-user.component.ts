import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedModule } from '../../../../modules/shared.module';
import { UserResponse } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { ToastService } from '../../../../common/toast.service';
@Component({
  selector: 'app-add-edit-user',
  standalone: true,
  imports: [SharedModule, CommonModule,],
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.scss'
})
export class AddEditUserComponent implements OnInit {
  userId?: string;
  public userDetail?: UserResponse;
  public userForm: FormGroup = new FormGroup({});
  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public toastService: ToastService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.userId = params.get('id') as string;
    });
    this.initForm();
    if (this.userId) {
      this.getUserDetail();
    }else{
      this.initForm();
    }
  }

  public initForm(data?: UserResponse): void {
    this.userForm = this.fb.group({
      user_id: new FormControl(data ? data.user_id : null),
      user_name: new FormControl(data ? data.user_name : null),
      phone_number: new FormControl(data ? data.phone_number : null),
      email: new FormControl(data ? data.email : null),
      address: new FormControl(data ? data.address : null),
      city: new FormControl(data ? data.city : null),
      full_name: new FormControl(data ? data.full_name : null),
      first_name: new FormControl(data ? data.first_name : null),
      last_name: new FormControl(data ? data.last_name : null),
      date_of_birth: new FormControl(data ? this.getFormattedDate(data.date_of_birth)  : null),
      shop_name: new FormControl(data ? data.shop_name : null),
      role_id: new FormControl(data ? data.role_id : null),
      state: new FormControl(data ? data.state : null),
      zip_code: new FormControl(data ? data.zip_code : null),
      country: new FormControl(data ? data.country : null),
      active: new FormControl(data ? data.active : null)
    });
  }

  getUserDetail(): void {
    this.spinner.show();
    this.userService.UserDetail(this.userId).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response) {
          this.userDetail = response.data;
          this.initForm(this.userDetail);
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        alert(error.error)
        console.error('Error inserting Category:', error);
      }
    });
  }

  async updateUser() {
    this.spinner.show();
    // this.category.category_type = 'PRODUCT_CATEGORY';
    this.userService.updateUser(this.userForm.getRawValue()).subscribe({
      next: (response) => {
        this.spinner.hide();
        if (response.code === 1) {
          this.toastService.showSuccess(response.message);
        } else if (response.code === 0) {
          this.toastService.showError(response.message);
        }
      },
      error: (error) => {
        this.spinner.hide();
        alert(error.error)
        console.error('Error inserting Category:', error);
      }
    });

  }

   getFormattedDate(timestamp: number): string {
    return new Date(timestamp).toISOString().split('T')[0];
  }


}
