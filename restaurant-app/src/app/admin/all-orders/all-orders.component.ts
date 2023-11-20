import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/shared/models/order.model';
import { Product } from 'src/app/shared/models/product.model';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styles: [
  ]
})
export class AllOrdersComponent implements OnInit {

  orders: Order[] = [];

  constructor(private service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders() {
    this.service.getAllOrders().subscribe({
      next: (data : Order[]) => {
        this.orders = data;
      },
      error: (error) => { 
        this.toastr.error(error.error);
      }
    })
  }

  showModal(products: Product[], amount: string) {
    let a = '';
    /*for(let product of products) {
      a = a.concat(', ', product.name)
    }
    a = a.substring(1);*/
    
    const modalProducts = document.getElementById('modalProducts')
    if (modalProducts) {
      modalProducts.innerText = 'Products:' + a;
    }
  }

}
