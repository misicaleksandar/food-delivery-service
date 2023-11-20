import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/shared/models/order.model';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styles: [
  ]
})
export class MyOrderComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;
  showPayPalOptions: boolean = false;

  customerHasAnActiveOrder: boolean = true;
  lastOrder: Order = new Order;

  constructor(private service: UserService, private toastr: ToastrService, private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.hasAnActiveOrder();
  }

  private initConfig(): void {
    this.payPalConfig = {
    currency: 'USD',
    clientId: 'AbOiN3hw-3PHdYn1b5JWbcaAvR8WrFC7oS3L5N2AxDU6-UMg39JOASt0eZK4gSHkqKo8j5Rg9dWKn9yV',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: this.lastOrder.totalPrice,
          }
        }
      ]
    },
    onClientAuthorization: (data) => {
      //console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.service.payForTheOrder(this.lastOrder.id).subscribe({
        next: (data: Order) => {
          this.hasAnActiveOrder();
        },
        error: (error) => {
          this.toastr.error(error.error);
        }
      })
    },
    onError: err => {
      console.log(err);
    }
  };
  }

  hasAnActiveOrder(){
    let email = localStorage.getItem('currentUser')!;
    this.service.customerHasAnActiveOrder(email).subscribe({
      next: (data: Order | null) => { 
        if(data != null) {
          this.customerHasAnActiveOrder = true;
          this.lastOrder = data;

          this.initConfig();

          if (this.lastOrder.paymentCompleted == false) {
            this.showPayPalOptions = true;
          }
          else {
            this.showPayPalOptions = false;
          }

          if(data.delivererId != 0) { 
            let time = new Date()
            time.setFullYear(data.year)
            time.setMonth(data.month - 1)
            time.setDate(data.day)
            time.setHours(data.hours)
            time.setMinutes(data.minutes)
            time.setSeconds(data.seconds)
            time.setMilliseconds(data.miliseconds)
            time.setMinutes(time.getMinutes() + 1)

            let now = new Date()
            const interval = setInterval(() => {
              now = new Date();
              let difference = time.getTime() - now.getTime();
              let seconds = Math.floor(difference / 1000);
              let minutes = Math.floor(seconds / 60);
              let hours = Math.floor(minutes / 60);
              hours %= 24;
              minutes %= 60;
              seconds %= 60;
              const tl = document.getElementById('timeLeft');
              if(tl) {
                tl.innerText = `${hours} : ${minutes} : ${seconds}`
              }
              if(now > time) {
                clearInterval(interval);
                this.customerHasAnActiveOrder = false;
              }
            }, 1000);
          }
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

}
