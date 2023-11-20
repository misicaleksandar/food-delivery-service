import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomerComponent } from './customer/customer.component';
import { MyOrderComponent } from './customer/my-order/my-order.component';
import { PreviousOrdersComponent } from './customer/previous-orders/previous-orders.component';
import { AdminComponent } from './admin/admin.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { VerificationComponent } from './admin/verification/verification.component';
import { AllOrdersComponent } from './admin/all-orders/all-orders.component';
import { DelivererComponent } from './deliverer/deliverer.component';
import { NewOrdersComponent } from './deliverer/new-orders/new-orders.component';
import { CurrentOrderComponent } from './deliverer/current-order/current-order.component';
import { MyOrdersComponent } from './deliverer/my-orders/my-orders.component';
import { AuthGuard } from './auth/auth.guard';
import { NewOrderComponent } from './customer/new-order/new-order.component';

const routes: Routes = [
  { path: '', redirectTo: 'user/login', pathMatch: 'full' },
  { path: 'user', component: UserComponent, children: [
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent }
  ] },
  
  { path:'profile', component:ProfileComponent, canActivate: [AuthGuard], data: { role: ['Administrator', 'Customer', 'Deliverer'] } },
  { path:'dashboard', component:DashboardComponent, canActivate: [AuthGuard], data: { role: ['Administrator', 'Customer', 'Deliverer', 'SocialCustomer'] } },
  
  { path: 'customer', component: CustomerComponent, children: [
    { path: 'new-order', component: NewOrderComponent },
    { path: 'my-order', component: MyOrderComponent },
    { path: 'previous-orders', component: PreviousOrdersComponent }
  ], canActivate: [AuthGuard], data: { role: ['Customer', 'SocialCustomer'] } },

  { path: 'admin', component: AdminComponent, children: [
    { path: 'add-product', component: AddProductComponent },
    { path: 'verification', component: VerificationComponent },
    { path: 'all-orders', component: AllOrdersComponent }
  ], canActivate: [AuthGuard], data: { role: 'Administrator' } },

  { path: 'deliverer', component: DelivererComponent, children: [
    { path: 'new-orders', component: NewOrdersComponent },
    { path: 'current-order', component: CurrentOrderComponent },
   { path: 'my-orders', component: MyOrdersComponent }
  ], canActivate: [AuthGuard], data: { role: 'Deliverer' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
