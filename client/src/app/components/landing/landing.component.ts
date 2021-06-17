import { Component, OnInit } from '@angular/core';

import { AccountService } from 'src/app/services/account.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  currentAccount: string | null = null;

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.currentAccount = this.accountService.getCurrentUser();
    this.accountService
    .accountObserver()
    .subscribe(
      value => this.currentAccount = value
    );
  }

  onClick(): void {
    this.accountService.accountRedirect();
  }

}
