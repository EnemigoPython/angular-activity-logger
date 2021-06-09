import { Component, OnInit } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { MenuForm } from '../../MenuForm';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  currentForm: MenuForm = 'Log in';

  constructor() { }

  ngOnInit(): void {
  }

}
