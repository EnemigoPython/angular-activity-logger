import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UiService } from '../../services/ui.service';
import { MenuForm } from '../../MenuForm';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  currentForm?: MenuForm;
  subscription?: Subscription;
  hide: boolean = true;

  constructor(
    private uiService: UiService,
    ) { }

  ngOnInit(): void {
    this.currentForm = this.uiService.getPath() === '/register' ? 'Register' : 'Log in';
    this.subscription = this.uiService
    .menuObserver()
    .subscribe(
      value => this.currentForm = value
    );
  }

  setCurrentForm(newForm: MenuForm): void {
    this.uiService.setMenuForm(newForm);
  }

}
