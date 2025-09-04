import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { HttpClientModule }     from '@angular/common/http';

import { BookRoutingModule }  from './book-routing.module';

import { OverviewComponent }    from './overview/overview.component';
import { DetailComponent }      from './detail/detail.component';
import { CreateComponent }      from './create/create.component';
import { EditComponent }        from './edit/edit.component';

import { TranslateModule } from '@ngx-translate/core';
import { BookService }        from './book.service';
import { BookComponent } from './book.component';
import { FormsModule} from '@angular/forms'
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    OverviewComponent,
    DetailComponent,
    CreateComponent,
    EditComponent,
    BookComponent
  ],
  imports: [
    CommonModule,         // *ngIf, *ngFor, etc.
    HttpClientModule,     // for any HTTP calls
    BookRoutingModule,   // your routes.forChild(...)
    FormsModule,
    TranslateModule,
    NgxPaginationModule,
  ],
  providers: [
    BookService         // so constructor(public bookService) works
  ]
})
export class BookModule { }
