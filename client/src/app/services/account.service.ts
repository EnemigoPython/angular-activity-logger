import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

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

  constructor(
    private http: HttpClient
  ) { }
  requestLogin(details: LoginDetails): void {

  }
  requestNewAccount(details: LoginDetails): Observable<LoginDetails> {
    console.log('hello');
    console.log(environment.API_URL);
    return this.http.get<LoginDetails>(this.apiUrl);
    // return this.http.post<LoginDetails>(this.apiUrl, details, httpOptions);
  }
}
