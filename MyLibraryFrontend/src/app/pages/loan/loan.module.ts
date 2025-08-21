import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { HttpClientModule }     from '@angular/common/http';

import { LoanRoutingModule }  from './loan-routing.module';

import { OverviewComponent }    from './overview/overview.component';
import { DetailComponent }      from './detail/detail.component';
import { CreateComponent }      from './create/create.component';
import { EditComponent }        from './edit/edit.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoanService }        from './loan.service';
import { NgxPaginationModule } from 'ngx-pagination';

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
    LoanRoutingModule,   // your routes.forChild(...)
    FormsModule,
    TranslateModule,
    NgxPaginationModule
  ],
  providers: [
    LoanService         // so constructor(public loanService) works
  ]
})
export class LoanModule { }
