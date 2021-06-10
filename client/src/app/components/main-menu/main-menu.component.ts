import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { UiService } from '../../services/ui.service';
import { AccountService } from 'src/app/services/account.service';

import { MenuForm } from '../../MenuForm';
import { LoginDetails } from '../../LoginDetails';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  currentForm?: MenuForm;
  subscription?: Subscription;
  hide: boolean = true;

  @Input() username = new FormControl('', [Validators.required]);
  @Input() password = new FormControl('', [Validators.required]);
  @Input() confirmPass = new FormControl('', [Validators.required, this.passwordsMatch()]);

  constructor(
    private uiService: UiService,
    private accountService: AccountService
    ) { }

  ngOnInit(): void {
    this.currentForm = this.uiService.getPath() === '/register' ? 'Register' : 'Log in';
    this.subscription = this.uiService
    .menuObserver()
    .subscribe(
      value => this.currentForm = value
    );
  }

  passwordsMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.password?.value === this.confirmPass?.value ? null : {notMatching: true};
    };
  }

  setCurrentForm(newForm: MenuForm): void {
    this.uiService.setMenuForm(newForm);
  }

  onSubmit(): void {
    const formValues: LoginDetails = {
      username: this.username.value,
      password: this.password.value
    }
    if (this.currentForm === 'Log in' && this.username.valid && this.password.valid) {
      this.accountService.requestLogin(formValues)
    } else if (this.username.valid && this.password.valid && this.confirmPass.valid) {
      this.accountService.requestNewAccount(formValues)
    }
    // console.log(this.username.valid && this.password.valid && this.confirmPass.valid);
    // console.log(this.username.value, this.password.value);
    // console.log(this.username.valid, this.password.valid, this.confirmPass.valid);
    // console.log(this.currentForm);
  }

}
