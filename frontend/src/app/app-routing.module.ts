// src/app/app-routing.module.ts
import { NgModule }           from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  // root-level redirect to “/members”
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  // lazy-load or eager-load your MemberRoutingModule
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
