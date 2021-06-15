import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';

import { LoginDetails } from '../types/LoginDetails';
import { UserRes } from '../types/UserRes';

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
  ) {}

  getStoredUser(): string | null {
    return localStorage.getItem('currentUser');
  }

  setCurrentUser(newUser: string) {
    this.currentUser = newUser;
    this.subject.next(this.currentUser);
    if (!localStorage.getItem('currentUser')) {
      localStorage.setItem('currentUser', this.currentUser);
    }
  }

  accountObserver(): Observable<any> {
    return this.subject.asObservable();
  }

  requestLogin(details: LoginDetails): Observable<UserRes> {
    return this.http.post<UserRes>(`${this.apiUrl}/users`, details, httpOptions);
  }

  signOut(): void {
    localStorage.removeItem('currentUser');
  }
}
