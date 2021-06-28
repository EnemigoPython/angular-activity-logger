import { Component, AfterViewInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { AccountService } from 'src/app/services/account.service';
import { ActivitiesService } from 'src/app/services/activities.service';

import { ActivityRow } from '../../types/ActivityRow';

const currentDate = new Date().toLocaleString('en-GB', {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements AfterViewInit {
  displayedColumns: string[] = ['date'];
  displayedData: ActivityRow[] = [{ date: currentDate }];
  dataSource = new MatTableDataSource(this.displayedData);
  currentID?: number;
  @Input() activityName: string = '';

  constructor(
    private accountService: AccountService,
    private activitiesService: ActivitiesService
  ) { }

  ngAfterViewInit() {
    this.accountService.observerID()
    .subscribe(
      id => {
        if (id > 0 && id !== this.currentID) {
          this.currentID = id;
          this.activitiesService.getUserActivities(id)
          .subscribe(
            data => {
              console.log(data);
              if (data.length > 0) {
                this.dataSource.data = this.activitiesService.buildTableFromIndices(data);
                this.displayedColumns = Object.keys(this.dataSource.data[0]);
                this.activitiesService.automaticDateRollover(data[data.length - 1].date)
              }
            }
          );
        }
      }
    );
  }

  test(j: number, col: string, item: string) {
    console.log(j, col, item);
    console.log(this.activitiesService.retrieveFromIndexID(`${col}[${j}]`));
  }

  addActivity() {
    if (!this.displayedColumns.includes(this.activityName)) {
      this.dataSource.data = this.dataSource.data.map(row => {
        return {...row, [this.activityName]: 'unreported'};
      });
      this.displayedColumns.push(this.activityName);
      this.activitiesService.postNewActivity(
        this.activityName, 
        this.dataSource.data.length,
        this.currentID!
      );
    }
    this.activityName = '';
  }

  removeActivity(activity: string) {
    this.activitiesService.deleteActivity(activity, this.currentID!);
    this.displayedColumns = this.displayedColumns.filter(col => col !== activity);
    this.dataSource.data = this.dataSource.data.map(row => {
      delete row[activity];
      return row;
    });
  }

}
