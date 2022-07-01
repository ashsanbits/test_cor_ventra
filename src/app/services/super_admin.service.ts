import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // return !this.Token.loggedIn();
    const type = localStorage.getItem('user_type');
    if (type == 'super_admin') {
      return true;
    } else {
        this.router.navigateByUrl('/home')
        return false;
    }
  }
  constructor(private router: Router) { }
}
