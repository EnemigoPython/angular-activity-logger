import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, Subject } from 'rxjs';

import { MenuForm } from '../MenuForm';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private menuForm?: MenuForm;
  private subject = new Subject<any>();

  constructor(
    private location: Location
  ) { }

  setMenuForm(newForm: MenuForm): void {
    this.location.go(newForm === 'Log in' ? 'login' : 'register');
    this.menuForm = newForm === 'Register' ? 'Register' : 'Log in';
    this.subject.next(this.menuForm);
  }

  menuObserver(): Observable<any> {
    return this.subject.asObservable();
  }

  getPath(): string {
    return this.location.path();
  }
}
