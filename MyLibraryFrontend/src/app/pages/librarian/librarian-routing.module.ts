// src/app/pages/librarian/librarian-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibrarianComponent } from './librarian.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  { path: '', component: LibrarianComponent },          // /librarian
  { path: ':id/detail', component: DetailComponent }    // /librarian/6/detail
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibrarianRoutingModule {}
