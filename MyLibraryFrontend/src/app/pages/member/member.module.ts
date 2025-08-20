import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { HttpClientModule }     from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { MemberRoutingModule }  from './member-routing.module';

import { OverviewComponent }    from './overview/overview.component';
import { DetailComponent }      from './detail/detail.component';
import { CreateComponent }      from './create/create.component';
import { EditComponent }        from './edit/edit.component';
import { FormsModule} from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core';
import { MemberService }        from './member.service';
import { MemberComponent } from './member.component';

@NgModule({
  declarations: [
    OverviewComponent,
    DetailComponent,
    CreateComponent,
    EditComponent,
    MemberComponent
  ],
  imports: [
    CommonModule,         // *ngIf, *ngFor, etc.
    HttpClientModule,     // for any HTTP calls
    NgxPaginationModule,
    MemberRoutingModule,   // your routes.forChild(...)
    FormsModule,
    TranslateModule
  ],
  providers: [
    MemberService         // so constructor(public memberService) works
  ]
})
export class MemberModule { }
