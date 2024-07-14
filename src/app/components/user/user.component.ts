import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from '../../models/user.model';
import { SharedModule } from '../../modules/shared.module';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public listUser: UserResponse[] = [];
  public requestParam = {
    page_number: 0,
    page_size: 10,
    sort_by: 'createDate',
    sort_direction: 'asc'

  };
  constructor(
    public userService : UserService,
    public router: Router
  ) { }

  ngOnInit() {
    this.getListUser();
  }

  insertUser() {
    this.router.navigate(['/add-user']);
  }

  getListUser() {
    this.userService.getListUser(this.requestParam).subscribe({
      next: (response: any) => {
        this.listUser = response.result_data?.userDetailList;
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
      }
    });
  }
  updateUser(userId: string) {
    this.router.navigate(['/update-user', userId]);
  }


  deleteUser(user: UserResponse) {
    const confirmation = window
      .confirm('Are you sure you want to delete this category?');
    if (confirmation) {
      this.userService.deleteUser(user.userId).subscribe({
        next: (response: string) => {
          location.reload();
        },
        complete: () => {
        },
        error: (error: any) => {
          alert(error.error)
          console.error('Error fetching categories:', error);
        }
      });
    }
  }
}
