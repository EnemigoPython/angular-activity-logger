import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './components/landing/landing.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';

import { AuthGuard } from './guards/auth.guard'

const routes: Routes = [
  { path: '', component: LandingComponent, canActivate: [AuthGuard] },
  { path: 'login', component: MainMenuComponent },
  { path: 'register', component: MainMenuComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
