import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

import { Activity } from '../types/Activity';
import { ActivityRow } from '../types/ActivityRow';

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
  private mapOfIDs: { [key: string]: number } = {};

  constructor(
    private http: HttpClient
  ) { }

  getUserActivities(id: number): Observable<Activity[]> {
    const params = new HttpParams().set("id", id);
    return this.http.get<Activity[]>(`${this.apiUrl}/activities`, {params: params});
  }

  buildTableFromIndices(dataIndices: Activity[]): ActivityRow[] {
    const table: ActivityRow[] = [];
    this.mapOfIDs = {};
    dataIndices.forEach(dataIndex => {
      if (!table.map(row => row.date).includes(dataIndex.date)) {
        table.push({ date: dataIndex.date });
      }
      switch(dataIndex.state) {
        case -1:
          table[table.length - 1][dataIndex.name] = 'failed';
          break;
        case 0:
          table[table.length - 1][dataIndex.name] = 'unreported';
          break;
        case 100:
          table[table.length - 1][dataIndex.name] = 'completed';
          break;
        default:
          table[table.length - 1][dataIndex.name] = 'in progress';
      }
      this.mapOfIDs[`${dataIndex.name}[${table.length - 1}]`] = dataIndex.id;
    });
    return table;
  }

  retrieveFromIndexID(index: string): number {
    return this.mapOfIDs[index];
  }

  postNewActivity(name: string, numberOfDates: number, id: number) {
    this.http.post<number[]>(`${this.apiUrl}/activities`, {name, numberOfDates, id})
    .subscribe(
      returnIDs => {
        returnIDs.forEach((ID, i) => {
          const index = i + 1;
          this.mapOfIDs[`${name}[${numberOfDates - index}]`] = ID
        });
      }
    );
  }
}
