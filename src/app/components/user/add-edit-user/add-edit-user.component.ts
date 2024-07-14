import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../../common/toast.service';
import { UserResponse } from '../../../models/user.model';
import { SharedModule } from '../../../modules/shared.module';
import { UserService } from '../../../services/user.service';

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
      user_id: new FormControl(data ? data.userId : null),
      phone_number: new FormControl(data ? data.phoneNumber : null),
      email: new FormControl(data ? data.email : null),
      address: new FormControl(data ? data.address : null),
      city: new FormControl(data ? data.city : null),
      first_name: new FormControl(data ? data.firstName : null),
      last_name: new FormControl(data ? data.lastName : null),
      role_id: new FormControl(data ? data.roleId : null),
      state: new FormControl(data ? data.state : null),
      zip_code: new FormControl(data ? data.zipCode : null)
    });
  }

  getUserDetail(): void {
    this.spinner.show();
    this.userService.getUserDetail(this.userId).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response) {
          this.userDetail = response.result_data;
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
        if (response.result_code === 1) {
          this.toastService.showSuccess(response.result_msg);
        } else if (response.result_code === 0) {
          this.toastService.showError(response.result_data.msg);
        }
      },
      error: (error) => {
        this.spinner.hide();
        alert(error.error)
        console.error('Error inserting Category:', error);
      }
    });

  }

}
