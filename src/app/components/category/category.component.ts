import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { TypeModel } from '../../models/type.model';
import { CategoryResponse } from '../../reponse/categoryResponse';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categories: CategoryResponse[] = []; // Dữ liệu động từ categoryService
  typeModel? :TypeModel;
  constructor(
    private categoryService: CategoryService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getCategories();
  }
  getCategories() {
    this.typeModel = {
      type: ["PRODUCT_CATEGORY"]
    };
    this.categoryService.getCategories(this.typeModel).subscribe({
      next: (response:any) => {
        this.categories = response.result_data?.categoryInfo;
      },
      complete: () => {
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
  insertCategory() {
    debugger
    // Điều hướng đến trang detail-category với categoryId là tham số
    this.router.navigate(['/add-category']);
  }
  updateCategory(categoryId: string) {
    this.router.navigate(['/update-category', categoryId]);
  }

  // // Hàm xử lý sự kiện khi sản phẩm được bấm vào
  // updateCategory(categoryId: number) {
  //   debugger
  //   this.router.navigate(['/admin/categories/update', categoryId]);
  // }
  deleteCategory(category: CategoryResponse) {
    const confirmation = window
      .confirm('Are you sure you want to delete this category?');
    if (confirmation) {
      debugger
      this.categoryService.deleteCategory(category.category_id).subscribe({
        next: (response: string) => {
          debugger
          alert('Xóa thành công')
          location.reload();
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          alert(error.error)
          console.error('Error fetching categories:', error);
        }
      });
    }
  }

}
