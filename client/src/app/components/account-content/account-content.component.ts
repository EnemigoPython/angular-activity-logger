import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { debounceTime, first } from 'rxjs/operators';

@Component({
  selector: 'app-account-content',
  templateUrl: './account-content.component.html',
  styleUrls: ['./account-content.component.css']
})
export class AccountContentComponent implements OnInit {
  @ViewChild('cardRef') cardRef!: ElementRef;
  tooLong: boolean = false;

  constructor(
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.stableObserver();
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

  manageScrollMode() {
    // very hacky
    this.tooLong = (window.innerWidth / 100) * 90 < this.cardRef.nativeElement.offsetWidth ?
    true : false;
  }

}
