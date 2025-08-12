import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../book.service';
import { AuthService } from '../../../services/auth.service';
import { Book } from '../book';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit {
  book?: Book | null;
  draft!: Book;                 // local editable copy
  editMode = false;

  loading = false;
  saving = false;
  deleting = false;

  message: { type: 'success' | 'error'; text: string } | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private books: BookService,
    private auth: AuthService
  ) {}

    get isMember(): boolean {
      return this.auth.isMember();
    }

   ngOnInit(): void {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (!id) return;

      this.loading = true;

      this.books.getBookDetail(id).subscribe({
        next: (b: Book) => {
          this.book = b;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.message = { type: 'error', text: 'Failed to load the book.' };
        }
      });
    }

   toggleEdit(): void {
     if (!this.book) return;
     this.editMode = !this.editMode;
     this.message = null;

     if (this.editMode) {
       this.draft = { ...this.book };
       // If available is optional in your model, default it so the checkbox binds safely
       this.draft.available = this.draft.available ?? false;
     }
   }

    save(): void {
      if (!this.book) return;
      this.saving = true;
      this.message = null;

      // ✅ your service expects a single Book object (not id + body)
      this.books.updateBook(this.draft).subscribe({
        next: (updated: Book) => {
          this.book = updated;
          this.editMode = false;
          this.saving = false;
          this.message = { type: 'success', text: 'Book updated successfully.' };
        },
        error: (err) => {
          this.saving = false;
          this.message = { type: 'error', text: 'Update failed. Please try again.' };
          console.error('Update error', err);
        }
      });
    }

    confirmDelete(): void {
      if (!this.book || this.deleting) return;
      const ok = window.confirm(`Delete “${this.book.title}”? This cannot be undone.`);
      if (!ok) return;

      this.deleting = true;
      this.message = null;

      this.books.deleteBook(this.book.id!).subscribe({
        next: () => {
          this.deleting = false;
          this.router.navigate(['../'], { relativeTo: this.route, queryParams: { deleted: '1' } });

        },
        error: (err) => {
          this.deleting = false;
          this.message = { type: 'error', text: 'Delete failed. Please try again.' };
          console.error('Delete error', err);
        }
      });
    }

    importCoverFromUrl() {
      const id = this.book?.id;                 // ✅ narrow first
      const url = this.draft?.coverUrl ?? '';

      if (!id || !url.startsWith('http')) return;

      this.saving = true;
      this.books.uploadCoverFromUrl(id, url).subscribe({
        next: () => {
          this.saving = false;
          this.message = { type: 'success', text: 'Cover imported.' };

          // cache-bust the image
          const img = document.querySelector<HTMLImageElement>('img.book-cover');
          if (img) img.src = `/api/books/${id}/cover?ts=${Date.now()}`;
        },
        error: (err) => {
          this.saving = false;
          this.message = { type: 'error', text: err?.error?.message || 'Import failed.' };
        }
      });
    }

    usePlaceholder(ev: Event) {
      (ev.target as HTMLImageElement).src = 'assets/book-placeholder.png';
    }
}
