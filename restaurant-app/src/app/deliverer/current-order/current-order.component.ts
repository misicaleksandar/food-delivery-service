import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/shared/models/order.model';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.component.html',
  styles: [
  ]
})
export class CurrentOrderComponent implements OnInit {
  delivererHasAnActiveOrder: boolean = false;

  currentOrder: Order = new Order

  constructor(private service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.hasAnActiveOrder();
  }

  hasAnActiveOrder() {
    let email = localStorage.getItem('currentUser')!;
    this.service.delivererHasAnActiveOrder(email).subscribe({
      next: (data: Order | null) => { 
        if(data != null) {
          this.delivererHasAnActiveOrder = true;
          this.currentOrder = data

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
            if(tl){
              tl.innerText = `${hours} : ${minutes} : ${seconds}`
            }
            if(now > time){
              clearInterval(interval);
              this.delivererHasAnActiveOrder = false;
            }
          }, 1000);
        }
        else {
          this.delivererHasAnActiveOrder = false;
        }
     },
      error: (error) => { 
        this.toastr.error(error.error);
      }
    })
  }

}
