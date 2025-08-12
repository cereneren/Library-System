import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LibrarianRoutingModule } from './librarian-routing.module';
import { DetailComponent } from './detail/detail.component';
import { LibrarianComponent } from './librarian.component';

@NgModule({
  declarations: [
    DetailComponent,       // ✅ declare it here
    LibrarianComponent
  ],
  imports: [
    CommonModule,          // ✅ gives you the date pipe
    FormsModule,
    LibrarianRoutingModule
  ]
})
export class LibrarianModule {}
