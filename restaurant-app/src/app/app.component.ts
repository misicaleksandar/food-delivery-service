import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './shared/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'restaurant-app';

  constructor(private router: Router, private service: UserService) { }

  isLoggedIn() : boolean {
    if (localStorage.getItem('currentUser') == null) {
      return false;
    }
    else {
      return true;
    }
  }

  logOut() {
    if (localStorage.getItem('currentUserType') == 'SocialCustomer') {
      this.service.signOutExternal();
    }
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserType');
    localStorage.removeItem('token');
    this.router.navigateByUrl('/user/login');
  }

}
