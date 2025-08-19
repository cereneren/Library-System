import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberComponent }       from './member.component';
import { LibrarianGuard } from '../../../core/guards/librarian.guard';
import { MemberGuard } from '../../../core/guards/member.guard';

const routes: Routes = [
  // Redirect empty path directly to books
  { path: '', redirectTo: 'books', pathMatch: 'full' },

  // Define child routes
  {
    path: 'books', canActivate: [MemberGuard],
    loadChildren: () =>
      import('../../book/book-routing.module').then(m => m.BookRoutingModule)
  },
  {
    path: 'loans', canActivate: [MemberGuard],
    loadChildren: () =>
      import('../../loan/loan-routing.module').then(m => m.LoanRoutingModule)
  },
  {
    path: 'info', canActivate: [MemberGuard],
    loadChildren: () =>
      import('../../member/member-routing.module').then(m => m.MemberRoutingModule)
  },


  // Fallback route
  { path: '**', redirectTo: 'books' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
