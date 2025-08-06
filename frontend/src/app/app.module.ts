import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MemberModule } from './pages/member/member.module';
import { BookModule } from './pages/book/book.module';
import { LoanModule } from './pages/loan/loan.module';
import { AuthModule } from './pages/auth/auth.module';
import { LibrarianModule } from './pages/librarian/librarian.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MemberModule,
    BookModule,
    LoanModule,
    AuthModule,
    LibrarianModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
