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
      // hopefully the any clause can be removed by proper typing at the next stage
      // e.g. https://stackoverflow.com/questions/56568423/typescript-no-index-signature-with-a-parameter-of-type-string-was-found-on-ty/56569217
      delete (row as any)[activity];
      return row;
    });
  }

}
