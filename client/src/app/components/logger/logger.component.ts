import { Component, AfterViewInit, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, first } from 'rxjs/operators';

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

  @ViewChild('cardRef') cardRef!: ElementRef;
  tooLong: boolean = false;

  constructor(
    private accountService: AccountService,
    private activitiesService: ActivitiesService,
    public dialog: MatDialog,
    private zone: NgZone
  ) { }

  ngAfterViewInit() {
    this.stableObserver();
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

  stableObserver() {
    // one time DOM check on page load (artificial timeout approach)
    this.zone.onStable
    .pipe(debounceTime(300))
    .pipe(first())
    .subscribe(
      () => this.manageScrollMode()
    );
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
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.dataSource.data = this.dataSource.data.map((row, i) => {
          if (i !== itemIndex) return row;
          return {...row, [col]: this.activitiesService.stateNumberToLabel(res.state)};
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
    this.manageScrollMode();
  }

  removeActivity(activity: string) {
    this.activitiesService.deleteActivity(activity, this.currentID!);
    this.displayedColumns = this.displayedColumns.filter(col => col !== activity);
    this.dataSource.data = this.dataSource.data.map(row => {
      delete row[activity];
      return row;
    });
    this.manageScrollMode();
  }

  manageScrollMode() {
    // very hacky
    this.tooLong = (window.innerWidth / 100) * 90 < this.cardRef.nativeElement.offsetWidth ?
    true : false;
  }

}
