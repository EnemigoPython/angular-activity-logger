import { Component, OnInit } from '@angular/core';

import { AccountService } from 'src/app/services/account.service';

import { UserStats } from 'src/app/types/UserStats';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent implements OnInit {
  currentAccount: string = '';
  currentID?: number;
  userStats?: UserStats;

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.currentAccount = this.accountService.getCurrentUser()!;
    this.accountService.observerID()
    .subscribe(
      id => {
        if (id > 0 && id !== this.currentID) {
          this.currentID = id;
          this.accountService.getAccountStats(id)
          .subscribe(
              stats => {
                this.userStats = stats;
              }
          );
        }
      });
  }

}
