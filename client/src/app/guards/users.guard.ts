import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate } from '@angular/router';

import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class UsersGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private router: Router
    ) {}

  currentAccount: string | null = this.accountService.getCurrentUser();

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // check that logged account matches id of request, else boot them
    if (this.currentAccount !== null) {
      this.accountService.lazyObserverID()
        .subscribe(
          id => {
            if (id > 0 && parseInt(route.url[1].path) !== id) {
              this.router.navigateByUrl('/');
            }
          }
        )
    } else {
      this.router.navigateByUrl('/');
    }
    return true;
  }
  
}
