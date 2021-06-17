import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

import { AccountService } from '../services/account.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // find stored account and log in
    if (this.accountService.getStoredUser() && !this.accountService.getCurrentUser()) {
      this.accountService.setCurrentUser(this.accountService.getStoredUser() || '');
    }
    // redirect login and register routes if already logged in
    if (this.accountService.getCurrentUser() && ['register', 'login'].includes(route.url[0]?.path)) {
      this.router.navigateByUrl('/');
    }
    return true;
  }
  
}
