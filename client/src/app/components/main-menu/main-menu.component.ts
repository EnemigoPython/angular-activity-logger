import { Component, OnInit, Input, Inject } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UiService } from '../../services/ui.service';
import { AccountService } from 'src/app/services/account.service';

import { MenuForm } from '../../types/MenuForm';
import { LoginDetails } from '../../types/LoginDetails';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  currentForm?: MenuForm;
  currentAccount: string | null = null;
  serverError: string | null = null;
  hide: boolean = true;

  @Input() username = new FormControl('', [Validators.required, Validators.maxLength(20)]);
  @Input() password = new FormControl('', [Validators.required, Validators.maxLength(20)]);
  @Input() confirmPass = new FormControl('', [Validators.required, this.passwordsMatch()]);

  constructor(
    private uiService: UiService,
    private accountService: AccountService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.currentForm = this.uiService.getPath() === '/register' ? 'Register' : 'Log in';
    this.uiService
      .menuObserver()
      .subscribe(
        value => this.currentForm = value
      );
    this.accountService
      .accountObserver()
      .subscribe(
        value => this.currentAccount = value
      );
  }

  passwordsMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.password?.value === this.confirmPass?.value ? null : { notMatching: true };
    };
  }

  setCurrentForm(newForm: MenuForm): void {
    this.uiService.setMenuForm(newForm);
  }

  formIsValid(): boolean {
    return this.currentForm === 'Log in' ?
      ![this.username.valid, this.password.valid].includes(false) :
      ![this.username.valid, this.password.valid, this.confirmPass.valid].includes(false);
  }

  onSubmit(): void {
    const formValues: LoginDetails = {
      username: this.username.value,
      password: this.password.value,
      newAccount: this.currentForm === 'Register'
    }

    if (this.formIsValid()) {
      this.accountService.requestLogin(formValues).subscribe(
        value => {
          if (value.username) {
            this.accountService.setCurrentUser(value.username);
            this.accountService.accountRedirect(value.id);
          } else {
            switch (value.error) {
              case "ER_DUP_ENTRY":
                this.serverError = "Username already taken.";
                break;
              case "NO_ACC":
                this.serverError = "Account not found.";
                break;
              case "PASS_INCORRECT":
                this.serverError = "Incorrect password.";
                break;
              default:
                this.serverError = "Server error.";
            }
            this.dialog.open(MenuDialog, {
              data: this.serverError,
              position: { top: "15%" }
            });
          }
        });
    }
  }

}


@Component({
  selector: 'menu-dialog',
  templateUrl: 'menu-dialog.html',
  styleUrls: ['./main-menu.component.css']
})
export class MenuDialog {

  constructor(
    public dialogRef: MatDialogRef<MenuDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}