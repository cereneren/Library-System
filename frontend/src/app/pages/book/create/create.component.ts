import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { Book } from '../book';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html'
})
export class CreateComponent {
  draft: Partial<Book> = {
    title: '',
    author: '',
    coverUrl: '',
    summary: ''
  };

  saving = false;
  message: { type: 'success' | 'error', text: string } | null = null;

  constructor(private bookService: BookService, private router: Router,  private route: ActivatedRoute) {}

  save() {
    if (!this.draft.title || !this.draft.author) return;

    this.saving = true;
    this.message = null;

    this.bookService.createBook(this.draft).subscribe({
      next: (createdBook) => {
        this.saving = false;
        this.message = { type: 'success', text: 'Book created successfully.' };

        // navigate to overview
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: () => {
        this.saving = false;
        this.message = { type: 'error', text: 'Failed to create book.' };
      }
    });
  }

  importCoverFromUrl() {
    if (this.draft.coverUrl) {
      this.message = { type: 'success', text: 'Cover imported (not uploaded).' };
    }
  }

  imageError = false;

  onImageError() {
    this.imageError = true;
    this.draft.coverUrl = ''; // optional: reset bad URL
  }
}
