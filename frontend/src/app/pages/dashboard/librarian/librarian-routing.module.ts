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

  // Fallback route
  { path: '**', redirectTo: 'books' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibrarianRoutingModule { }
