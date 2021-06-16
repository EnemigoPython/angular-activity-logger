import { Component, OnInit } from '@angular/core';

import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentAccount: string | null = null;

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.accountService
    .accountObserver()
    .subscribe(
      value => this.currentAccount = value
    );
  }

  onClick(): void {
    this.accountService.accountRedirect();
  }

  signOut(): void {
    this.accountService.signOut();
  }

  title = 'Activity Logger';
}
