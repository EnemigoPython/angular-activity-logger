import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { MenuForm } from '../MenuForm';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private menuForm?: MenuForm;
  private subject = new Subject<any>();

  constructor() { }

  setMenuForm(newForm: MenuForm): void {
    this.menuForm = newForm === 'Register' ? 'Register' : 'Log in';
    this.subject.next(this.menuForm);
  }

  menuObserver(): Observable<any> {
    return this.subject.asObservable();
  }
}
