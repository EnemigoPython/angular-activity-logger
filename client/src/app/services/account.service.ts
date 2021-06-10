import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';

import {LoginDetails} from '../LoginDetails';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = environment.API_URL;
  private currentUser: string | null = null;
  private subject = new Subject<any>();

  constructor(
    private http: HttpClient
  ) { }

  setCurrentUser(newUser: string) {
    this.currentUser = newUser;
    this.subject.next(this.currentUser);
  }

  requestLogin(details: LoginDetails): void {

  }

  requestNewAccount(details: LoginDetails): Observable<LoginDetails> {
    return this.http.get<LoginDetails>(this.apiUrl);
    // return this.http.post<LoginDetails>(this.apiUrl, details, httpOptions);
  }
}
