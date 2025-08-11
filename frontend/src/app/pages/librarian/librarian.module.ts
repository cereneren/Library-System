// src/app/pages/librarian/librarian.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibrarianComponent } from './librarian.component';
import { LibrarianRoutingModule } from './librarian-routing.module';

@NgModule({
  declarations: [LibrarianComponent],
  imports: [CommonModule, LibrarianRoutingModule],
})
export class LibrarianModule {}
