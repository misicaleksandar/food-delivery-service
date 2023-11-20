import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { ProfileComponent } from './profile/profile.component';
import { DelivererComponent } from './deliverer/deliverer.component';
import { NewOrdersComponent } from './deliverer/new-orders/new-orders.component';
import { MyOrdersComponent } from './deliverer/my-orders/my-orders.component';
import { CurrentOrderComponent } from './deliverer/current-order/current-order.component';
import { CustomerComponent } from './customer/customer.component';
import { NewOrderComponent } from './customer/new-order/new-order.component';
import { MyOrderComponent } from './customer/my-order/my-order.component';
import { PreviousOrdersComponent } from './customer/previous-orders/previous-orders.component';
import { AdminComponent } from './admin/admin.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { AllOrdersComponent } from './admin/all-orders/all-orders.component';
import { VerificationComponent } from './admin/verification/verification.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { HttpClientModule } from "@angular/common/http"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './shared/user.service';
import { NgxPayPalModule } from 'ngx-paypal';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent,
    ProfileComponent,
    DelivererComponent,
    NewOrdersComponent,
    MyOrdersComponent,
    CurrentOrderComponent,
    CustomerComponent,
    MyOrderComponent,
    PreviousOrdersComponent,
    AdminComponent,
    AddProductComponent,
    AllOrdersComponent,
    VerificationComponent,
    DashboardComponent,
    NewOrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains:environment.allowedDomains
      }
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      progressBar: false
    }),
    SocialLoginModule,
    NgxPayPalModule

  ],
  providers: [
    UserService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '870532228365-ovou7n0gdbm7pc65293k8pqih7ob5rlv.apps.googleusercontent.com'
            )
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
