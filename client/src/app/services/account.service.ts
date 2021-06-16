import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
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
    private http: HttpClient,
    private router: Router
  ) {}

  getStoredUser(): string | null {
    return localStorage.getItem('currentUser');
  }

  getCurrentUser(): string | null {
    return this.currentUser;
  }

  setCurrentUser(newUser: string) {
    this.currentUser = newUser;
    this.subject.next(this.currentUser);
    localStorage.setItem('currentUser', this.currentUser);
  }

  accountObserver(): Observable<any> {
    return this.subject.asObservable();
  }

  requestLogin(details: LoginDetails): Observable<UserRes> {
    return this.http.post<UserRes>(`${this.apiUrl}/users`, details, httpOptions);
  }

  signOut(): void {
    this.currentUser = null;
    this.subject.next(this.currentUser);
    localStorage.removeItem('currentUser');
  }
}
