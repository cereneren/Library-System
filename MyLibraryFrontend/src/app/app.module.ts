import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MemberModule } from './pages/member/member.module';
import { LibrarianModule } from './pages/librarian/librarian.module';
import { BookModule } from './pages/book/book.module';
import { LoanModule } from './pages/loan/loan.module';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormsModule} from '@angular/forms'
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'
import { AuthInterceptor } from './services/auth.interceptor';
import { MemberComponent } from './pages/dashboard/member/member.component';
import { LibrarianComponent } from './pages/dashboard/librarian/librarian.component'
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeDe from '@angular/common/locales/de';
import localeTr from '@angular/common/locales/tr';
import { NgxPaginationModule } from 'ngx-pagination';

registerLocaleData(localeTr);
registerLocaleData(localeDe);
registerLocaleData(localeEn);

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
    NgxPaginationModule,
    MemberModule,
    LoanModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      // v17 way: provider function (no token/provider array needed)
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }),
  ],
  providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
