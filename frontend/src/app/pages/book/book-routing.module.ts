import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {DetailComponent} from './detail/detail.component';
import {CreateComponent} from './create/create.component';
import {EditComponent} from './edit/edit.component';

const routes: Routes = [
  // when URL is /books → redirect to /books/overview
  { path: '',  redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview',       component: OverviewComponent },
  { path: ':id/detail',    component: DetailComponent },
  { path: 'create',         component: CreateComponent },
  { path: ':id/edit',       component: EditComponent },
  { path: '**', redirectTo: 'books' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
