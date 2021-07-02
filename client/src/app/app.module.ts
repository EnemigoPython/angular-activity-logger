import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { HeaderComponent } from './components/header/header.component';
import { MainMenuComponent, MenuDialog } from './components/main-menu/main-menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { LandingComponent } from './components/landing/landing.component';

import { AppComponent } from './app.component';
import { LoggerComponent } from './components/logger/logger.component';
import { DialogWindowComponent } from './components/dialog-window/dialog-window.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainMenuComponent,
    FooterComponent,
    LandingComponent,
    LoggerComponent,
    DialogWindowComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatButtonToggleModule
  ],
  entryComponents: [
    DialogWindowComponent,
    MenuDialog
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
