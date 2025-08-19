import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LibrarianService } from '../librarian.service';
import { Librarian } from '../librarian';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-librarian-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {

  librarian: Librarian = { id: 0, fullName: '', email: '', password: '', dateCreated: '', dateUpdated: ''};
  isSubmitting = false;

  constructor(
    public librarianService: LibrarianService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      console.error('No librarian ID in route');
      return;
    }

    this.librarianService.getLibrarianDetail(id).subscribe({
      next: (m: Librarian) => this.librarian = m,
      error: (err) => console.error('Failed to load librarian', err)
    });
  }

   async save() {
      this.isSubmitting = true;
      const payload: Librarian = {
        id: this.librarian.id,
        fullName: this.librarian.fullName?.trim() ?? '',
        email: this.librarian.email?.trim() ?? ''
      } as Librarian;

      try {
        await firstValueFrom(this.librarianService.updateLibrarian(payload));
        await this.router.navigate(['..','detail'], { relativeTo: this.route });
      } catch (e) {
        console.error('Update failed', e);
      } finally {
        this.isSubmitting = false;
      }
    }


}
