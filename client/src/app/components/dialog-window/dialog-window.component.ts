import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ActivitiesService } from 'src/app/services/activities.service';

import { ActivityDialog } from 'src/app/types/ActivityDialog';
import { ActivityState } from 'src/app/types/ActivityState';

@Component({
  selector: 'app-dialog-window',
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.css']
})
export class DialogWindowComponent implements OnInit {

  state: number = 0;
  activityState?: ActivityState;
  notes: string = "";

  constructor(
    private activityService: ActivitiesService,
    public dialogRef: MatDialogRef<DialogWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActivityDialog
  ) { }

  ngOnInit(): void {
    this.activityService.getActivity(this.data.id)
    .subscribe(
      data => {
        this.state = data.state;
        this.notes = data.notes;
        this.activityState = 
        this.state === 0 ? 'Unreported' :
        this.state === -1 ? 'Failed' :
        this.state > 99 ? 'Completed' :
        'In Progress';
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onProgressSelect() {
    this.state =
    this.state < 1 ? 1 :
    this.state > 99 ? 99 :
    this.state;
  }

  onSave(): void {
    if (this.activityState !== 'In Progress') {
      this.state = 
      this.activityState === 'Failed' ? -1 :
      this.activityState === 'Completed' ? 100 :
      this.state;
    }
    const newState: ActivityDialog = {
      name: this.data.name,
      id: this.data.id,
      state: this.state,
      notes: this.notes
    };
    this.activityService.updateActivity(newState)
    .subscribe(
      res => {
        if (res) {
          this.dialogRef.close(newState.state);
        }
      }
    );
  }

  percentFormat(value: number): string {
    return `${value}%`;
  }

}
