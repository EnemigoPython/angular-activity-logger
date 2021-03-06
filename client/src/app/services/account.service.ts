import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { LoginDetails } from '../types/LoginDetails';
import { UserRes } from '../types/UserRes';
import { UserStats } from '../types/UserStats';

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
  private currentID: number = 0;
  private accountSubject = new Subject<string | null>();
  private subjectID = new BehaviorSubject<number>(0);
  private lazySubjectID = new Subject<number>();
  private statsSubject = new Subject<UserStats>();

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
    this.accountSubject.next(this.currentUser);
    localStorage.setItem('currentUser', this.currentUser);
    this.getCurrentID().toPromise()
    .then(id => {
      if (typeof id !== 'number') {
        throw new Error("Validation Error");
      }
      this.currentID = id;
      this.subjectID.next(this.currentID);
      this.lazySubjectID.next(this.currentID);
    })
    .catch(err => {
      console.error(err);
      this.signOut();
    });
  }

  getCurrentID(): Observable<number> {
    const params = new HttpParams().set("user", this.currentUser!);
    return this.http.get<number>(`${this.apiUrl}/users/id`, {params: params});
  }

  observerID(): Observable<any> {
    return this.subjectID.asObservable();
  }

  lazyObserverID(): Observable<any> {
    return this.lazySubjectID.asObservable();
  }
  
  accountObserver(): Observable<any> {
    return this.accountSubject.asObservable();
  }

  requestLogin(details: LoginDetails): Observable<UserRes> {
    return this.http.post<UserRes>(`${this.apiUrl}/users`, details, httpOptions);
  }

  accountRedirect(id?: number) {
    if (id) {
      this.router.navigateByUrl(`/user/${id}`);
    } else {
      if (this.currentID > 0) this.router.navigateByUrl(`/user/${this.currentID}`);
    }
  }

  signOut(): void {
    this.currentUser = null;
    this.accountSubject.next(this.currentUser);
    localStorage.removeItem('currentUser');
    this.router.navigateByUrl('/');
  }

  getAccountStats(id: number) {
    const params = new HttpParams().set("id", id);
    this.http.get<UserStats>(`${this.apiUrl}/users/stats`, {params})
    .subscribe(
      stats => this.statsSubject.next(stats)
    );
  }

  statsObserver(): Observable<any> {
    return this.statsSubject.asObservable();
  }

  deleteAccount() {
    const options = {
      headers: httpOptions.headers,
      body: {
        id: this.currentID
      }
    };
    return this.http.delete(`${this.apiUrl}/users`, options);
  }
}
