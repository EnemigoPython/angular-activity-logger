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
test: "axzczxcsdferdgsdfsdf"}
];

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit {
  displayedColumns: string[] = ['date', 'test', 'xyz'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @Input() activityName: string = '';
  constructor() { }

  ngOnInit(): void {
  }

  test(row: string[]) {
    console.log(row);
  }

  addActivity() {
    console.log(this.activityName);
    this.displayedColumns.push(this.activityName);
    this.activityName = '';
  }

  removeActivity() {

  }

}
