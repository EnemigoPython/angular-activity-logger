import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'

const date = new Date();

const ELEMENT_DATA: Object[] = [
  {date: date.toLocaleDateString("en-GB", 
  {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }),
  test: "unreported"}
];

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit {
  displayedColumns: string[] = ['date', 'test'];
  displayedData = [...ELEMENT_DATA]
  dataSource = new MatTableDataSource(this.displayedData);
  @Input() activityName: string = '';
  constructor() { }

  ngOnInit(): void {
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
      delete (row as any)[activity];
      return {...row};
    });
  }

}
