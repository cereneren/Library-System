import { NgModule }           from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {LayoutComponent} from './pages/layout/layout.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {LibrarianComponent} from './pages/dashboard/librarian/librarian.component';
import {MemberComponent} from './pages/dashboard/member/member.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

   {
      path: 'login',
      component: LoginComponent
    },
   {
      path: '',
      component: LayoutComponent,
      children: [
        {
        path: 'dashboard',
        component: DashboardComponent
        }
      ]
    },
     {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
          {
          path: 'member',
          component: MemberComponent,
          loadChildren: () =>
                import('./pages/book/book-routing.module')
                  .then(m => m.BookRoutingModule)
          },
          {
          path: 'librarian',
          component: LibrarianComponent,
          loadChildren: () =>
                import('./pages/dashboard/librarian/librarian-routing.module')
                  .then(m => m.LibrarianRoutingModule)
          }
        ]
      },
  /* route everything else to login
   {
      path: '**',
      component: LoginComponent
    },
  */
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
