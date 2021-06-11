import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';

import {LoginDetails} from '../LoginDetails';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
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

  accountObserver(): Observable<any> {
    return this.subject.asObservable();
  }

  requestLogin(details: LoginDetails): void {

  }

  requestNewAccount(details: LoginDetails): Observable<LoginDetails> {
    console.log(details);
    return this.http.post<LoginDetails>(`${this.apiUrl}/users`, details, httpOptions);
    // return this.http.post<LoginDetails>(this.apiUrl, details, httpOptions);
    // return this.http.get<LoginDetails>(this.apiUrl);
  }
}
