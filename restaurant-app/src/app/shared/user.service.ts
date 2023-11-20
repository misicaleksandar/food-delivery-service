import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { ToastrService } from 'ngx-toastr';
import { User } from './models/user.model';
import { Login } from './models/login.model';
import { Observable } from 'rxjs';
import { Registration } from './models/registration.model';
import { Upload } from './models/upload.model';
import { Deliverer } from './models/deliverer.model';
import { Order } from './models/order.model';
import { Product } from './models/product.model';
import { environment } from 'src/environments/environment';
import { OrderItem } from './models/order-item.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private externalAuthService: SocialAuthService, 
    private router: Router, private toastr: ToastrService) {

      this.externalAuthService.authState.subscribe((user: SocialUser) => {
        if(user != null) {
          console.log(user);
          this.externalLogin(user.provider, user.idToken).subscribe({
            next: (data : User) => {
              localStorage.setItem('currentUser', data.email);
              localStorage.setItem('currentUserType', data.type);
              localStorage.setItem('token', data.token);
              this.router.navigateByUrl('dashboard');
            },
            error: (error) => {
              this.toastr.error(error.error, 'Authentication failed');
            }
          });
        }
      });

  }


  //user
  register(registration:Registration) : Observable<Object> {
    return this.http.post<Object>(environment.serverURL + '/api/User/register', registration);
  }
  
  upload(formData: FormData) : Observable<Upload> {
    return this.http.post<Upload>(environment.serverURL + '/api/User/upload-picture', formData);
  }

  login(login:Login) : Observable<User> {
    return this.http.post<User>(environment.serverURL + '/api/User/login', login);
  }

  getUserByEmail(email:string) : Observable<Registration> {
    return this.http.get<Registration>(environment.serverURL + `/api/User/${email}`);
  }

  getImage(serverPath: string) {
    return `${environment.serverURL}/${serverPath}`;
  }

  updateProfile(registration:Registration) : Observable<Registration> {
    return this.http.put<Registration>(environment.serverURL + '/api/User/update', registration);
  }

  changePassword(registration:Registration) : Observable<Registration> {
    return this.http.put<Registration>(environment.serverURL + '/api/User/password', registration);
  }

  getDeliverers() : Observable<Deliverer[]> {
    return this.http.get<Deliverer[]>(environment.serverURL + '/api/User/deliverers')
  }

  changeDelivererStatus(email:string, approve:Boolean) : Observable<Object> {
    return this.http.put<Object>(environment.serverURL + '/api/User/verification', { "email": email, "approve": approve });
  }


  //customer
  getProducts() : Observable<Product[]> {
    return this.http.get<Product[]>(environment.serverURL + '/api/Product/all');
  }
  
  customerHasAnActiveOrder(email: string) : Observable<Order | null> {
    return this.http.get<Order | null>(environment.serverURL + `/api/Order/active-order/${email}`);
  }

  order(email: string, orderItems: OrderItem[], address: string, lat: number, lon: number, paymentMethod: string) : Observable<Object> {
    return this.http.post<Object>(environment.serverURL + '/api/Order/create', { "email": email, "orderItems": orderItems, "address": address, "lat": lat, "lon": lon, "paymentMethod": paymentMethod });
  }

  payForTheOrder(id: string) : Observable<Order> {
    return this.http.put<Order>(environment.serverURL + '/api/Order/pay', { "id": id });
  }

  getPreviousOrders(email: string) : Observable<Order[]> {
    return this.http.get<Order[]>(environment.serverURL + `/api/Order/previous-orders/${email}`);
  }


  //deliverer
  getNewOrders() : Observable<Order[]> {
    return this.http.get<Order[]>(environment.serverURL + '/api/Order/new-orders');
  }

  delivererHasAnActiveOrder(email: string) : Observable<Order | null> {
    return this.http.get<Order | null>(environment.serverURL + `/api/Order/has-active-order/${email}`);
  }

  acceptOrder(id: number, email: string) : Observable<Order> {
    return this.http.put<Order>(environment.serverURL + '/api/Order/accept', { "orderId": id, "delivererEmail": email });
  }

  getMyOrders(email: string) : Observable<Order[]> {
    return this.http.get<Order[]>(environment.serverURL + `/api/Order/my-orders/${email}`);
  }


  //administrator
  getAllOrders() : Observable<Order[]> {
    return this.http.get<Order[]>(environment.serverURL + '/api/Order/all');
  }

  addProduct(product: Product) : Observable<Object> {
    return this.http.post<Object>(environment.serverURL + '/api/Product', product);
  }
  


  
  externalLogin(provider: string, idToken: string) : Observable<User> {
    return this.http.post<User>(environment.serverURL + '/api/User/external-login', { "provider": provider, "idToken": idToken });
  }
  public signOutExternal = () => {
    this.externalAuthService.signOut();
  }
  
  
}
