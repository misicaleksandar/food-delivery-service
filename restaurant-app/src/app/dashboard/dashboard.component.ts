import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  isCustomer(): boolean {
    if(localStorage.getItem('currentUserType') == 'Customer'){
      return true;
    }
    else {
      return false;
    }
  }

  isSocialCustomer(): boolean {
    if(localStorage.getItem('currentUserType') == 'SocialCustomer'){
      return true;
    }
    else {
      return false;
    }
  }

  isDeliverer(): boolean {
    if(localStorage.getItem('currentUserType') == 'Deliverer'){
      return true;
    }
    else {
      return false;
    }
  }

  isAdministrator(): boolean {
    if(localStorage.getItem('currentUserType') == 'Administrator'){
      return true;
    }
    else {
      return false;
    }
  }

}
