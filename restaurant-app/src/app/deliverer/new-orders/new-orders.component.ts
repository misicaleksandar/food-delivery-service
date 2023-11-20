import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet'
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/shared/models/order.model';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-new-orders',
  templateUrl: './new-orders.component.html',
  styles: [
  ]
})
export class NewOrdersComponent implements OnInit {
  map!: L.Map;
  selectedOrder: string = ''

  newOrders: Order[] = [];
  email: string = '';

  constructor(private service: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.fixMarker();
    this.initMap();
    this.getNewOrders();
  }

  initMap() {
    this.map = L.map('map').setView([45.252590, 19.833010], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  getNewOrders() {
    this.service.getNewOrders().subscribe({
      next: (data) => {
        this.newOrders = data;
        this.drawMarkers();
      },
      error: (error) => { 
        this.toastr.error(error.error);
      }
    })
  }

  drawMarkers() {
    this.newOrders.forEach((element) => {
      const marker = L.marker([element.lat, element.lon]).addTo(this.map).on('click', (marker) => {
        const modal = document.getElementById('modalButton') as HTMLButtonElement
        this.selectedOrder = element.id
        this.fillModal(element)
        modal.click()
      });
    })
  }

  fillModal(order: Order) {
    let a = '';
    /*for(let product of order.products) {
      a = a.concat(', ', product.name)
    }
    a = a.substring(1);*/

    const modalCustomer = document.getElementById('modalCustomer')
    if (modalCustomer) {
      modalCustomer.innerText = 'Customer: ' + order.customerEmail;
    }

    const modalAddress = document.getElementById('modalAddress')
    if (modalAddress) {
      modalAddress.innerText = 'Address: ' + order.address;
    }
    
    const modalProducts = document.getElementById('modalProducts')
    if (modalProducts) {
      modalProducts.innerText = 'Products: ' + a;
    }

    const modalPrice = document.getElementById('modalPrice')
    if (modalPrice) {
      modalPrice.innerText = 'Total price: ' + order.totalPrice + '$';
    }

    const modalPaymentCompleted = document.getElementById('modalPaymentCompleted')
    if (modalPaymentCompleted) {
      let paid = order.paymentCompleted ? 'Yes' : 'No'
      modalPaymentCompleted.innerText = 'Charged: ' + paid;
    }

  }

  
  hasAnActiveOrder() {
    this.email = localStorage.getItem('currentUser')!;

    this.service.delivererHasAnActiveOrder(this.email).subscribe({
      next: (data : Order | null) => { 
        if (data != null) {
          this.toastr.warning('You currently have an active order');
        }
        else {
          this.acceptOrder();
        }
      },
      error: (error) => { 
        this.toastr.error(error.error);
      }
    });
  }

  acceptOrder() {
    this.service.acceptOrder(parseInt(this.selectedOrder), this.email).subscribe({
      next: (data: Order) => { 
        this.router.navigateByUrl('/deliverer/current-order');
      },
      error: (error) => { 
        this.toastr.error(error.error);
      }
    });
  }

  fixMarker() {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

}
