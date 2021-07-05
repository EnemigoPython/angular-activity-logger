import { Component, AfterViewInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { DialogWindowComponent } from '../dialog-window/dialog-window.component';

import { AccountService } from 'src/app/services/account.service';
import { ActivitiesService } from 'src/app/services/activities.service';

import { ActivityRow } from '../../types/ActivityRow';

const currentDate = new Date()
  .toLocaleString('en-GB', {
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  resultsPerPage: number = 7;

  @Output() checkLong = new EventEmitter();

  constructor(
    private accountService: AccountService,
    private activitiesService: ActivitiesService,
    public dialog: MatDialog
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.accountService.observerID()
    .subscribe(
      id => {
        if (id > 0 && id !== this.currentID) {
          this.currentID = id;
          this.activitiesService.getUserActivities(id)
          .subscribe(
            data => {
              if (data.length > 0) {
                const absentDaysCount = this.activitiesService.countAbsentDays(data[data.length - 1].activityDate);
                if (absentDaysCount > 0) {
                  this.activitiesService.updateRecentDates(absentDaysCount, id)
                    .subscribe(newData => {
                      this.dataSource.data = this.activitiesService.buildTableFromIndices(data.concat(newData));
                      this.displayedColumns = Object.keys(this.dataSource.data[0]);
                    });
                } else {
                  this.dataSource.data = this.activitiesService.buildTableFromIndices(data);
                  this.displayedColumns = Object.keys(this.dataSource.data[0]);
                }
              }
            }
          );
        }
      }
    );
  }

  defineColour(i: number, state: string): string {
    if (!i) return "#ffffff";
    switch (state) {
      case "in progress":
        return "#d1f8ff";
      case "completed":
        return "#d4ffd1";
      case "failed":
        return "#ffbeab";
      default:
        return "#ffffff";
    }
  }

  selectActivity(j: number, col: string) {
    const itemIndex = j + (this.paginator.pageIndex * this.resultsPerPage);
    const dialogRef = this.dialog.open(DialogWindowComponent, {
      data: {
        name: col,
        id: this.activitiesService.retrieveFromIndexID(`${col}[${itemIndex}]`)
      },
      position: { top: "15%" }
    });
    dialogRef.afterClosed().subscribe(state => {
      if (state) {
        this.dataSource.data = this.dataSource.data.map((row, i) => {
          if (i !== itemIndex) return row;
          return {...row, [col]: this.activitiesService.stateNumberToLabel(state)};
        });
      }
    });
  }

  addActivity() {
    if (!this.displayedColumns.includes(this.activityName)) {
      this.dataSource.data = this.dataSource.data.map(row => {
        return { ...row, [this.activityName]: 'unreported' };
      });
      this.displayedColumns.push(this.activityName);
      this.activitiesService.postNewActivity(
        this.activityName,
        this.dataSource.data.length,
        this.currentID!
      );
    }
    this.activityName = '';
    this.checkLong.emit();
  }

  removeActivity(activity: string) {
    this.activitiesService.deleteActivity(activity, this.currentID!);
    this.displayedColumns = this.displayedColumns.filter(col => col !== activity);
    this.dataSource.data = this.dataSource.data.map(row => {
      delete row[activity];
      return row;
    });
    this.checkLong.emit();
  }

}
