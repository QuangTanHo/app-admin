import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutsComponent } from './components/layouts/layouts.component';
import { HomeComponent } from './components/home/home.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ExamplesComponent } from './components/examples/examples.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AdminGuardFn } from './guards/admin.guard';
import { ProductDetailComponent } from './components/product-list/product-detail/product-detail.component';
import { CategoryComponent } from './components/category/category.component';
import { CategoryCreateComponent } from './components/category/categoryCreate/categoryCreate.component';
import { CategoryUpdateComponent } from './components/category/category-update/category-update.component';
import { AddProductComponent } from './components/product-list/add-product/add-product.component';
import { ManageImageComponent } from './components/manage-image/manage-image.component';
import { UserComponent } from './components/user/user.component';
import { PostArticleComponent } from './components/post-article/post-article.component';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "",
        component: LayoutsComponent,
        canActivate: [AdminGuardFn],
        children: [
            {
                path: "",
                component: HomeComponent,
                canActivate: [AdminGuardFn],
            },
            {
                path: "examples",
                component: ExamplesComponent,
                canActivate: [AdminGuardFn],
            },
            {
                path: "product-list",
                component: ProductListComponent,
                canActivate: [AdminGuardFn],
            },
            {
                path: "product-detail",
                component: ProductDetailComponent,
                canActivate: [AdminGuardFn],
            },
            {
                path: "add-product",
                component: AddProductComponent,
                canActivate: [AdminGuardFn],
            },
            {
                path: "category",
                component: CategoryComponent,
                canActivate: [AdminGuardFn],
            },
            {
                path: "add-category",
                component: CategoryCreateComponent,
                canActivate: [AdminGuardFn],
            },
            {
                path: "update-category/:id",
                component: CategoryUpdateComponent,
                canActivate: [AdminGuardFn],
            },
            {
                path: "manage-image",
                component: ManageImageComponent,
                canActivate: [AdminGuardFn],
            }
            ,
            {
                path: "manage-user",
                component: UserComponent,
                canActivate: [AdminGuardFn],
            }
            ,
            {
                path: "manage-article",
                component: PostArticleComponent,
                canActivate: [AdminGuardFn],
            }
        ]
    }
];
