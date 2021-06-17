import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './components/landing/landing.component';
import { LoggerComponent } from './components/logger/logger.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';

import { AuthGuard } from './guards/auth.guard'
import { UsersGuard } from './guards/users.guard'

const routes: Routes = [
  { path: '', component: LandingComponent, canActivate: [AuthGuard] },
  { path: 'login', component: MainMenuComponent, canActivate: [AuthGuard] },
  { path: 'register', component: MainMenuComponent, canActivate: [AuthGuard] },
  { path: 'user/:id', component: LoggerComponent, canActivate: [AuthGuard, UsersGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
