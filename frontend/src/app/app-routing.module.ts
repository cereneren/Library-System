// src/app/app-routing.module.ts
import { NgModule }           from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  // root-level redirect to “/members”
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  // lazy-load or eager-load your MemberRoutingModule
  {
    path: 'members',
    loadChildren: () =>
      import('./member/member-routing.module')
        .then(m => m.MemberRoutingModule)
  },
  {
    path: 'books',
    loadChildren: () =>
      import('./book/book-routing.module')
        .then(m => m.BookRoutingModule)
  },
  {
    path: 'loans',
    loadChildren: () =>
      import('./loan/loan-routing.module')
        .then(m => m.LoanRoutingModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
