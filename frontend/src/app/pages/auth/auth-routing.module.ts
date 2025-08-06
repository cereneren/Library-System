import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
    // when URL is /books → redirect to /books/overview
    { path: '',  redirectTo: 'login', pathMatch: 'full' },
    { path: 'login',       component: LoginComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
