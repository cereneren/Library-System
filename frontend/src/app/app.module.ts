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
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormsModule} from '@angular/forms'
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'
import { CustomeInterceptor } from './services/custome.interceptor';
import { MemberComponent } from './pages/dashboard/member/member.component';
import { LibrarianComponent } from './pages/dashboard/librarian/librarian.component'


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    DashboardComponent,
    MemberComponent,
    LibrarianComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MemberModule,
    BookModule,
    LoanModule,
    AuthModule,
    LibrarianModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: CustomeInterceptor,
    multi: true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
