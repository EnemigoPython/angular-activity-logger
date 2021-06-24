import { Component, AfterViewInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { AccountService } from 'src/app/services/account.service';
import { ActivitiesService } from 'src/app/services/activities.service';

import { ActivityRow } from '../../types/ActivityRow';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements AfterViewInit {
  displayedColumns: string[] = ['date'];
  displayedData: ActivityRow[] = [];
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
              this.dataSource.data = this.activitiesService.buildTableFromIndices(data);
              this.displayedColumns = Object.keys(this.dataSource.data[0]);
            }
          );
        }
      }
    );
  }

  test(i: number, j: number, item: string) {
    console.log(i, j, item);
    console.log(this.activitiesService.retrieveFromIndexID(`${i},${j}`));
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
