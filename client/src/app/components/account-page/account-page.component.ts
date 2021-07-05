import { Component, OnInit } from '@angular/core';

import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent implements OnInit {
  currentAccount: string = '';

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.currentAccount = this.accountService.getCurrentUser()!;
  }

}
