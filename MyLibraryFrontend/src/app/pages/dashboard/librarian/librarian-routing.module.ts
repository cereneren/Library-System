import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibrarianComponent }       from './librarian.component';

const routes: Routes = [
  // Redirect empty path directly to books
  { path: '', redirectTo: 'books', pathMatch: 'full' },

  // Define child routes
  {
    path: 'books',
    loadChildren: () =>
      import('../../book/book-routing.module').then(m => m.BookRoutingModule)
  },
  {
    path: 'members',
    loadChildren: () =>
      import('../../member/member-routing.module').then(m => m.MemberRoutingModule)
  },
  {
    path: 'loans',
    loadChildren: () =>
      import('../../loan/loan-routing.module').then(m => m.LoanRoutingModule)
  },
  {
    path: 'info',
    loadChildren: () =>
      import('../../librarian/librarian-routing.module').then(m => m.LibrarianRoutingModule)
  },


  // Fallback route
  { path: '**', redirectTo: 'books' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibrarianRoutingModule { }
