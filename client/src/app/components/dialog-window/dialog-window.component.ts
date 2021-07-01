import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ActivityDetail } from 'src/app/types/ActivityDialog';

@Component({
  selector: 'app-dialog-window',
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.css']
})
export class DialogWindowComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActivityDetail
  ) { }

  ngOnInit(): void {
  }

}
