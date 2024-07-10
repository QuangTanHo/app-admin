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

  categories: CategoryResponse[] = []; 
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
    this.router.navigate(['/add-category']);
  }
  updateCategory(categoryId: string) {
    this.router.navigate(['/update-category', categoryId]);
  }


  deleteCategory(category: CategoryResponse) {
    const confirmation = window
      .confirm('Are you sure you want to delete this category?');
    if (confirmation) {
      this.categoryService.deleteCategory(category.category_id).subscribe({
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
