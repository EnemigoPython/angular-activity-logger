import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ActivitiesService } from 'src/app/services/activities.service';

import { ActivityDialog } from 'src/app/types/ActivityDialog';

@Component({
  selector: 'app-dialog-window',
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.css']
})
export class DialogWindowComponent implements OnInit {

  constructor(
    private activityService: ActivitiesService,
    public dialogRef: MatDialogRef<DialogWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActivityDialog
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.activityService.getActivity(this.data.id)
    .subscribe(
      res => console.log(res)
    );
  }

}
