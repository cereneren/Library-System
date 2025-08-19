import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibrarianComponent }       from './librarian.component';
import { LibrarianGuard } from '../../../core/guards/librarian.guard';
import { MemberGuard } from '../../../core/guards/member.guard';

const routes: Routes = [
  // Redirect empty path directly to books
  { path: '', redirectTo: 'books', pathMatch: 'full' },

  // Define child routes
  {
    path: 'books', canActivate: [LibrarianGuard],
    loadChildren: () =>
      import('../../book/book-routing.module').then(m => m.BookRoutingModule)
  },
  {
    path: 'members', canActivate: [LibrarianGuard],
    loadChildren: () =>
      import('../../member/member-routing.module').then(m => m.MemberRoutingModule)
  },
  {
    path: 'loans', canActivate: [LibrarianGuard],
    loadChildren: () =>
      import('../../loan/loan-routing.module').then(m => m.LoanRoutingModule)
  },
  {
    path: 'info', canActivate: [LibrarianGuard],
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
