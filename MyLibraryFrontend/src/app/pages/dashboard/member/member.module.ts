import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MemberRoutingModule } from './member-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { RecommendationsComponent } from './recommendations/recommendations.component';

@NgModule({
  declarations: [
    RecommendationsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MemberRoutingModule,
    TranslateModule
  ]
})
export class MemberModule { }
