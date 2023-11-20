import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(localStorage.getItem('token') != null && route.data['role'].indexOf(localStorage.getItem('currentUserType')) != -1) {
        return true;
      }
      else { 
        this.router.navigateByUrl('/user/login');
        return false; 
      }
  }
  
}
