import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountContentComponent } from './account-content.component';

describe('AccountContentComponent', () => {
  let component: AccountContentComponent;
  let fixture: ComponentFixture<AccountContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
