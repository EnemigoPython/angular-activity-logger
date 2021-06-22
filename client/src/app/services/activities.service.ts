import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Activity } from '../types/Activity';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  private apiUrl = environment.API_URL;

  constructor(
    private http: HttpClient
  ) { }

  getUserActivities(id: number) {
    const params = new HttpParams().set("id", id);
    return this.http.get<Activity[]>(`${this.apiUrl}/activities`, {params: params});
  }
}
