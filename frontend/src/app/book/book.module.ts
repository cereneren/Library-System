import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { HttpClientModule }     from '@angular/common/http';

import { BookRoutingModule }  from './book-routing.module';

import { OverviewComponent }    from './overview/overview.component';
import { DetailComponent }      from './detail/detail.component';
import { CreateComponent }      from './create/create.component';
import { EditComponent }        from './edit/edit.component';

import { BookService }        from './book.service';

@NgModule({
  declarations: [
    OverviewComponent,
    DetailComponent,
    CreateComponent,
    EditComponent
  ],
  imports: [
    CommonModule,         // *ngIf, *ngFor, etc.
    HttpClientModule,     // for any HTTP calls
    BookRoutingModule   // your routes.forChild(...)
  ],
  providers: [
    BookService         // so constructor(public bookService) works
  ]
})
export class BookModule { }
