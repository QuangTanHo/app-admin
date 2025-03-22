import { Routes } from '@angular/router';
import { ExamplesComponent } from './components/examples/examples.component';
import { HomeComponent } from './components/home/home.component';
import { LayoutsComponent } from './components/layouts/layouts.component';
import { LoginComponent } from './components/login/login.component';
import { AdminGuardFn } from './guards/admin.guard';
import { UserComponent } from './components/pages/user/user.component';
import { AddEditUserComponent } from './components/pages/user/add-edit-user/add-edit-user.component';
import { OrderProductComponent } from './components/pages/order-product/order-product.component';

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
                path: "manage-user",
                component: UserComponent,
                canActivate: [AdminGuardFn],
            },
            {
              path: "add-user",
              component: AddEditUserComponent,
              canActivate: [AdminGuardFn],
            },
            {
              path: "update-user/:id",
              component: AddEditUserComponent,
              canActivate: [AdminGuardFn],
            },
            {
                path: "order-product",
                component: OrderProductComponent,
                canActivate: [AdminGuardFn],
            },  
            
        ]
    }
];
