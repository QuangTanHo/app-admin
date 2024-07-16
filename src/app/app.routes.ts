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
import { UpdateProductComponent } from './components/product-list/update-product/update-product.component';
import { UpdateArticleComponent } from './components/post-article/update-article/update-article.component';
import { AddArticleComponent } from './components/post-article/add-article/add-article.component';
import { AttributeComponent } from './components/attribute/attribute.component';
import { AddAttributeComponent } from './components/attribute/add-attribute/add-attribute.component';
import { UpdateAttributeComponent } from './components/attribute/update-attribute/update-attribute.component';

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
                path: "update-product/:id",
                component: UpdateProductComponent,
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
                path: "list-article",
                component: PostArticleComponent,
                canActivate: [AdminGuardFn],
            },
            {
                path: "add-article",
                component: AddArticleComponent,
                canActivate: [AdminGuardFn],
            },
            {
                path: "update-article/:id",
                component: UpdateArticleComponent,
                canActivate: [AdminGuardFn],
            }
            ,
            {
                path: "attribute",
                component: AttributeComponent,
                canActivate: [AdminGuardFn],
            }
            ,
            {
                path: "add-attribute",
                component: AddAttributeComponent,
                canActivate: [AdminGuardFn],
            }
            ,
            {
                path: "update-attribute/:id",
                component: UpdateAttributeComponent,
                canActivate: [AdminGuardFn],
            }
        ]
    }
];
