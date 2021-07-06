import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

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
    private accountService: AccountService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.currentAccount = this.accountService.getCurrentUser()!;
    this.accountService.statsObserver()
    .subscribe(
      stats => this.userStats = stats
    );
  }

  onDelete() {
    this.dialog.open(DeleteDialog, {
      position: { top: "15%" }
    });
  }

}

@Component({
  selector: 'app-delete-dialog',
  templateUrl: 'delete-dialog.html',
  styleUrls: ['./account-page.component.css']
})
export class DeleteDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteDialog>,
    private accountService: AccountService
    ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirmDelete() {
    this.dialogRef.close();
    this.accountService.deleteAccount()
    .subscribe(
      res => this.accountService.signOut()
    );
  }

}