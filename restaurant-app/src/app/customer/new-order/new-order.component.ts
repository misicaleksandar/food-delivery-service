import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OrderItem } from 'src/app/shared/models/order-item.model';
import { Order } from 'src/app/shared/models/order.model';
import { Product } from 'src/app/shared/models/product.model';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styles: [
  ]
})
export class NewOrderComponent implements OnInit {

  customerHasAnActiveOrder: boolean = true;
  
  orderForm = this.fb.group({
    Address: ['', Validators.required],
    PaymentMethod: ['', Validators.required]
  });

  products: Product[] = [];

  orderItems: OrderItem[] = [];
  totalPrice: number = 0;

  geocodingResult: any;

  constructor(private service: UserService, private toastr: ToastrService, private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.hasAnActiveOrder();
    this.getProducts();
  }

  hasAnActiveOrder(){
    let email = localStorage.getItem('currentUser')!;
    this.service.customerHasAnActiveOrder(email).subscribe({
      next: (data: Order | null) => { 
        if(data != null) {
          this.customerHasAnActiveOrder = true;
        }
        else {
          this.customerHasAnActiveOrder = false;
        }
      },
      error: (error) => { 
        this.toastr.error(error.error);
      }
    });
  }

  getProducts() {
    this.service.getProducts().subscribe({
      next: (data: Product[]) => { 
        this.products = data; 
      },
      error: (error) => { 
        this.toastr.error(error.error);
      }
    });
  }

  addProductToCart(product: Product) {
    if (this.orderItems.some(item => item.name == product.name)) {
      this.toastr.warning('You have already added this product');
    }
    else {
      this.orderItems.push({name: product.name, ingredients: product.ingredients, price: product.price, amount: 1});
      this.onAmountChange();
    }
  }

  onAmountChange(){
    this.totalPrice = 0;
    for (let product of this.orderItems) {
      this.totalPrice += product.price * product.amount;
    }
  }

  removeItemFromCart(orderItem: OrderItem) {
    if (this.orderItems.includes(orderItem)) {
      const index = this.orderItems.indexOf(orderItem, 0);
      this.orderItems.splice(index, 1);
      this.onAmountChange();
    }
  }

  async createOrder() {
    this.hasAnActiveOrder();
    if (this.customerHasAnActiveOrder) {
      this.toastr.warning('Your already have an active order');
      return;
    }

    let email = localStorage.getItem('currentUser')!;
    
    let address = this.orderForm.value.Address;
    var url = 'https://nominatim.openstreetmap.org/search?format=json&limit=3&q=' + address;
    await fetch(url)
              .then((response) => response.json())
              .then((data) => this.geocodingResult = data)
              .catch(error => console.log(error))

    let paymentMethod = this.orderForm.value.PaymentMethod;

    if(this.geocodingResult[0] == undefined) {
      const invalidAddress = document.getElementById('invalidAddress') as HTMLLabelElement
      invalidAddress.hidden = false
      return;
    }

    this.service.order(email, this.orderItems, address, 
      this.geocodingResult[0].lat, this.geocodingResult[0].lon, paymentMethod).subscribe({
      next: (data) => {
        this.hasAnActiveOrder();
        this.orderForm.reset();
        this.toastr.success('The order has been sent successfully');
      },
      error: (error) => { 
        this.toastr.error(error.error);
      }
    })
  }

  
}
