import { Component, AfterViewInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { AccountService } from 'src/app/services/account.service';
import { ActivitiesService } from 'src/app/services/activities.service';

import { ActivityRow } from '../../types/ActivityRow';

const date = new Date();

const ELEMENT_DATA: ActivityRow[] = [
  {date: date.toLocaleDateString("en-GB", 
  {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }),
  test: "unreported"},
  {date: date.toLocaleDateString("en-GB", 
  {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }),
  test: "unreported",
  x: "unreported"}
];

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements AfterViewInit {
  displayedColumns: string[] = ['date', 'test', 'x'];
  displayedData = [...ELEMENT_DATA];
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
        if (id > 0) {
          this.activitiesService.getUserActivities(id)
          .subscribe(
            data => console.log(data)
          );
        }
      }
    );
  }

  test(row: string[]) {
    console.log(row);
  }

  addActivity() {
    if (!this.displayedColumns.includes(this.activityName)) {
      this.dataSource.data = this.dataSource.data.map(row => {
        return {...row, [this.activityName]: 'unreported'};
      });
      this.displayedColumns.push(this.activityName);
    }
    this.activityName = '';
  }

  removeActivity(activity: string) {
    this.displayedColumns = this.displayedColumns.filter(col => col !== activity);
    this.dataSource.data = this.dataSource.data.map(row => {
      delete row[activity];
      return row;
    });
  }

}
