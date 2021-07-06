import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { debounceTime, first } from 'rxjs/operators';

import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-account-content',
  templateUrl: './account-content.component.html',
  styleUrls: ['./account-content.component.css']
})
export class AccountContentComponent implements OnInit {
  @ViewChild('cardRef') cardRef!: ElementRef;
  tooLong: boolean = false;

  currentID?: number;

  constructor(
    private zone: NgZone,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.stableObserver();
    this.accountService.observerID()
    .subscribe(
      id => {
        if (id > 0 && id !== this.currentID) {
          this.currentID = id;
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

  tabSwitchHandler() {
    this.manageScrollMode();
    this.accountService.getAccountStats(this.currentID!);
  }

  manageScrollMode() {
    // very hacky
    this.tooLong = (window.innerWidth / 100) * 90 < this.cardRef.nativeElement.offsetWidth ?
    true : false;
  }

}
