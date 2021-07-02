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

  state: number = 0;
  activityState?: string;

  constructor(
    private activityService: ActivitiesService,
    public dialogRef: MatDialogRef<DialogWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActivityDialog
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.activityService.getActivity(this.data.id)
    .subscribe(
      data => {
        this.state = data.state;
        console.log(data);
        console.log(this.state);
        this.activityState = 
        this.state === 0 ? 'Unreported' :
        this.state === -1 ? 'Failed' :
        this.state > 99 ? 'Completed' :
        'In Progress';
      }
    );
  }

}
