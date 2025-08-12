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
    summary: ''
  };

  saving = false;
  uploadingCover = false;

  // cover upload state
  selectedCoverFile: File | null = null;
  previewUrl: string | null = null;

  message: { type: 'success' | 'error', text: string } | null = null;

  constructor(
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onCoverFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.selectedCoverFile = file;

    // preview
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = file ? URL.createObjectURL(file) : null;
  }

  save() {
    if (!this.draft.title || !this.draft.author) return;

    this.saving = true;
    this.message = null;

    // 1) create the book (without cover)
    this.bookService.createBook(this.draft).subscribe({
      next: (createdBook) => {
        // 2) if a cover file is chosen, upload it like in detail page
        if (this.selectedCoverFile) {
          this.uploadingCover = true;
          this.bookService.uploadCover(createdBook.id, this.selectedCoverFile).subscribe({
            next: () => this.finishSuccess(),
            error: () => this.finishError()
          });
        } else {
          this.finishSuccess();
        }
      },
      error: () => this.finishError()
    });
  }

  private finishSuccess() {
    this.uploadingCover = false;
    this.saving = false;
    this.message = { type: 'success', text: 'Book created successfully.' };
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private finishError() {
    this.uploadingCover = false;
    this.saving = false;
    this.message = { type: 'error', text: 'Failed to create book.' };
  }
}
