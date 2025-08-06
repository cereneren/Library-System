import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MemberModule } from './member/member.module';
import { BookModule } from './book/book.module';
import { LoanModule } from './loan/loan.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MemberModule,
    BookModule,
    LoanModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
