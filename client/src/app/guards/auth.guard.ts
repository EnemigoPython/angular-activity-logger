import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AccountService } from '../services/account.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private accountService: AccountService
  ) {}

  canActivate(): boolean {
    if (this.accountService.getStoredUser() && !this.accountService.getCurrentUser()) {
      this.accountService.setCurrentUser(this.accountService.getStoredUser() || '');
    }
    return true;
  }
  
}
