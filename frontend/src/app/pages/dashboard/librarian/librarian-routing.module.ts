import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibrarianComponent }       from './librarian.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'books',
        loadChildren: () =>
          import('../../book/book-routing.module')
            .then(m => m.BookRoutingModule)
      },
      {
        path: 'members',
        loadChildren: () =>
          import('../../member/member-routing.module')
            .then(m => m.MemberRoutingModule)
      }
    ]
  },
  // fallback & whatever else you have…
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: '**', redirectTo: 'books' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibrarianRoutingModule { }
