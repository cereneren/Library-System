import { NgModule }           from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {LayoutComponent} from './pages/layout/layout.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

   {
      path: 'login',
      component: LoginComponent
    },
   {
      path: '',
      component: LayoutComponent,
      children: [
        {
        path: 'dashboard',
        component: DashboardComponent
        }
      ]
    },
  /* route everything else to login
   {
      path: '**',
      component: LoginComponent
    },
  */
  {
    path: 'members',
    loadChildren: () =>
      import('./pages/member/member-routing.module')
        .then(m => m.MemberRoutingModule)
  },
  {
    path: 'books',
    loadChildren: () =>
      import('./pages/book/book-routing.module')
        .then(m => m.BookRoutingModule)
  },
  {
    path: 'loans',
    loadChildren: () =>
      import('./pages/loan/loan-routing.module')
        .then(m => m.LoanRoutingModule)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth-routing.module')
        .then(m => m.AuthRoutingModule)
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
