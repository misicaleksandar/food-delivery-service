import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Deliverer } from 'src/app/shared/models/deliverer.model';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styles: [
  ]
})
export class VerificationComponent implements OnInit {

  deliverers: Deliverer[] = [];

  constructor(private service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.refreshTable();
  }

  refreshTable() {
    this.service.getDeliverers().subscribe({
      next: (data : Deliverer[]) => { 
        this.deliverers = data; 
      },
      error: (error) => { 
        this.toastr.error(error.error);
      }
    })
  }

  changeDelivererStatus(email: string, approve: Boolean) {
    this.service.changeDelivererStatus(email, approve).subscribe({
      next: (data) => { 
        this.refreshTable() 
      },
      error: (error) => { 
        this.toastr.error(error.error);
      }
    })
  }

}
