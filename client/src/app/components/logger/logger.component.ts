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
      this.displayedData[0] = {...this.displayedData[0], [this.activityName]: 'unreported'};
      this.displayedColumns.push(this.activityName);
      console.log(this.displayedData == this.dataSource.data);
      this.activityName = '';
    }
    // this.displayedData = [...ELEMENT_DATA, {[this.activityName]: 'unreported'}];
    // this.displayedData = [...this.displayedData, {[this.activityName]: 'unreported'}];
  }

  removeActivity() {

  }

}
