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
    this.http.post<number[]>(`${this.apiUrl}/activities`, {name, numberOfDates, id}, httpOptions)
    .subscribe(
      returnIDs => {
        returnIDs.forEach((ID, i) => {
          const index = i + 1;
          this.mapOfIDs[`${name}[${numberOfDates - index}]`] = ID
        });
      }
    );
  }

  deleteActivity(name: string, id: number) {
    const options = {
      headers: httpOptions.headers,
      body: {
        name,
        id
      }
    };
    this.http.delete(`${this.apiUrl}/activities`, options)
    .subscribe();
  }

  automaticDateRollover(lastDate: string) {
    // current date converted to UTC
    const currentDate = new Date();
    const utcCurrent = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()));
    // last date in table converted to Date & defaulted to UTC
    const dateSegments = lastDate.split("/");
    const stringToDate = new Date(`${dateSegments[2]}-${dateSegments[1]}-${dateSegments[0]}Z`);

    const diffTime = Math.abs(utcCurrent.getTime() - stringToDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    console.log(diffDays, diffTime, utcCurrent.getTime(), stringToDate.getTime());
  }
}
