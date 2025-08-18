import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { Book } from '../book';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';

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

  // kept for templates that may read it
  message: { type: 'success' | 'error', text: string } | null = null;

  constructor(
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  // --- helpers ---
  private t(key: string, params?: Record<string, any>) {
    return this.translate.instant(key, params);
  }

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });

  // in onCoverFileSelected(...)
  onCoverFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    // allow only JPG/PNG/WEBP (tweak as you like)
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];

    if (file && !allowed.includes(file.type)) {
      // nice message (use ngx-translate if you want)
      Swal.fire({ icon: 'error', title: 'Error', text: this.t('BOOKS.COVER_UNSUPPORTED_TYPE') || 'Unsupported image type. Allowed: JPG, PNG, WEBP.' });
      this.selectedCoverFile = null;
      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
      input.value = '';
      return;
    }

    this.selectedCoverFile = file;
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = file ? URL.createObjectURL(file) : null;
  }


  save() {
    const title = this.draft.title?.trim();
    const author = this.draft.author?.trim();

    if (!title || !author) {
      Swal.fire({
        icon: 'info',
        title: this.t('COMMON.INFO'),
        text: this.t('BOOKS.MISSING_FIELDS') // “Please enter title and author.”
      });
      return;
    }

    this.saving = true;
    this.message = null;

    // 1) Create the book
    this.bookService.createBook({ ...this.draft, title, author })
      .subscribe({
        next: (createdBook) => {
          // 2) If no cover chosen, we are done
          if (!this.selectedCoverFile) {
            this.finishSuccess();
            return;
          }

          // 3) Try to upload cover; if it fails, roll back (delete the created book)
          this.uploadingCover = true;
          this.bookService.uploadCover(createdBook.id, this.selectedCoverFile)
            .pipe(finalize(() => (this.uploadingCover = false)))
            .subscribe({
              next: () => {
                // cover uploaded — success!
                this.finishSuccess();
              },
              error: (coverErr: HttpErrorResponse) => {
                // 🔴 Cover failed — roll back the book creation
                this.bookService.deleteBook(createdBook.id).subscribe({
                  next: () => {
                    this.saving = false;
                    const text =
                      coverErr?.error?.message ??
                      (typeof coverErr?.error === 'string' ? coverErr.error : this.t('BOOKS.COVER_UPLOAD_FAILED_ROLLBACK'));
                    this.message = { type: 'error', text };
                    Swal.fire({ icon: 'error', title: this.t('COMMON.ERROR'), text });
                    // do NOT navigate; keep form data so user can retry
                  },
                  error: (rollbackErr: HttpErrorResponse) => {
                    this.saving = false;
                    const text =
                      rollbackErr?.error?.message ??
                      (typeof rollbackErr?.error === 'string' ? rollbackErr.error : this.t('BOOKS.COVER_UPLOAD_FAILED_ROLLBACK_FAILED'));
                    this.message = { type: 'error', text };
                    Swal.fire({ icon: 'error', title: this.t('COMMON.ERROR'), text });
                  }
                });
              }
            });
        },
        error: (createErr: HttpErrorResponse) => {
          // create failed — show error
          this.saving = false;
          const text =
            createErr?.error?.message ??
            (typeof createErr?.error === 'string' ? createErr.error : this.t('BOOKS.CREATE_FAILED'));
          this.message = { type: 'error', text };
          Swal.fire({ icon: 'error', title: this.t('COMMON.ERROR'), text });
        }
      });
  }

  private finishSuccess() {
    this.saving = false;
    this.message = { type: 'success', text: this.t('BOOKS.CREATE_SUCCESS') };
    this.toast.fire({ icon: 'success', title: this.t('BOOKS.CREATE_SUCCESS') });

    // reset & go back to list
    this.resetForm();
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private resetForm() {
    this.draft = { title: '', author: '', summary: '' };
    if (this.previewUrl) { URL.revokeObjectURL(this.previewUrl); }
    this.previewUrl = null;
    this.selectedCoverFile = null;
  }
}
