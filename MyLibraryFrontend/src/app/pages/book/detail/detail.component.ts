import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../book.service';
import { AuthService } from '../../../services/auth.service';
import { LoanService } from '../../loan/loan.service';
import { MemberService } from '../../member/member.service';
import { Loan } from '../../loan/loan';
import { Member } from '../../member/member';
import { Book } from '../book';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit {
  locale$ = this.i18n.locale$;
  public Math = Math;
  book?: Book | null;
  draft!: Book;                 // local editable copy
  editMode = false;
  selectedNumberOfDays: number = 14;
  days: number[] = Array.from({ length: 30 }, (_, i) => i + 1);

  borrowing = false;
  borrowSuccess?: string;
  borrowError?: string;

  currentLoan: Loan | null = null;
  loadingLoan = false;

  // List fetched from API (for librarian to pick a borrower etc.)
  members: Member[] = [];

  // --- UI state ---
  loading = false;
  saving = false;
  deleting = false;

  message: { type: 'success' | 'error'; text: string } | null = null;

  private readonly PLACEHOLDER = 'assets/nocover.png';

  // locale demo
  current = 'de-DE';
  data = { selDate: new Date() };
  switch(newLocale: string) { this.current = newLocale; }

  // --- Member picker/search state used by template ---
  memberQuery = '';
  selectedMemberId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private books: BookService,
    private auth: AuthService,
    private loans: LoanService,
    private memberService: MemberService,          // <-- renamed
    private translate: TranslateService,
    private i18n: I18nService
  ) {}

  // --- i18n + toast helpers ---
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

  get isMember(): boolean {
    return this.auth.isMember();
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.loading = true;

    const session = JSON.parse(localStorage.getItem('user') || 'null');
    if (session?.role === 'LIBRARIAN') {
      this.getAllMembers();
    } else if (session?.role === 'MEMBER') {
      // MEMBER borrows for self
      this.selectedMemberId = session.id;
    }

    this.books.getBookDetail(id).subscribe({
      next: (b: Book) => {
        this.book = b;
        this.loading = false;
        this.fetchActiveLoan();
      },
      error: () => {
        this.loading = false;
        this.message = { type: 'error', text: this.t('BOOKS.LOAD_FAILED') };
      }
    });
  }


  private fetchActiveLoan(): void {
    if (!this.book?.id) return;
    this.loadingLoan = true;
    this.loans.getActiveLoanForBook(this.book.id).subscribe({
      next: loan => { this.currentLoan = loan; this.loadingLoan = false; },
      error: _ =>   { this.currentLoan = null; this.loadingLoan = false; }
    });
  }

  isOverdue(dueIso?: string | null): boolean {
    if (!dueIso) return false;
    return new Date(dueIso).getTime() < Date.now();
  }

  daysOverdue(dueIso?: string | null): number {
    if (!dueIso) return 0;
    const due = new Date(dueIso);
    const now = new Date();
    due.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffMs = now.getTime() - due.getTime();
    return Math.max(0, Math.floor(diffMs / 86400000));
  }

  toggleEdit(): void {

    if (!this.book) return;
    this.editMode = !this.editMode;
    this.message = null;

    if (this.editMode) {
      this.draft = { ...this.book };
      this.draft.available = this.draft.available ?? false;
    }
  }

  save(): void {
    if (!this.book) return;

    // how many are currently on loan based on what's on screen
    const activeLoans = Math.max(0, (this.book.totalCopies || 0) - (this.book.availableCopies || 0));
    const newTotal = Math.max(0, this.draft.totalCopies || 0);

    // 1) don't allow going below active loans
    if (newTotal < activeLoans) {
      Swal.fire({
        icon: 'error',
        title: this.t('COMMON.ERROR'),
        text: this.t('BOOKS.STOCK_TOTAL_BELOW_ON_LOAN', { count: activeLoans })
              || `Total copies cannot be less than ${activeLoans} (active loans).`

      });
      return;
    }

    this.saving = true;
    this.message = null;

    this.books.updateBook(this.draft).subscribe({
      next: (updated: Book) => {
        // 2) recompute available from activeLoans if backend didn't send it
        const serverAvail = (updated as any).availableCopies;
        const finalAvail = typeof serverAvail === 'number'
          ? serverAvail
          : Math.max(0, (updated.totalCopies || 0) - activeLoans);

        // 3) update the details card and availability flag
        this.book = { ...updated, availableCopies: finalAvail, available: finalAvail > 0 };

        this.editMode = false;
        this.saving = false;
        this.message = { type: 'success', text: this.t('BOOKS.UPDATE_SUCCESS') };
      },
      error: (err) => {
        this.saving = false;
        this.message = { type: 'error', text: this.t('BOOKS.UPDATE_FAILED') };
        console.error('Update error', err);
      }
    });
  }

  confirmDelete(): void {
    if (!this.book || this.deleting) return;

    Swal.fire({
      icon: 'warning',
      title: this.t('BOOKS.CONFIRM_DELETE_TITLE'),
      text: this.t('BOOKS.CONFIRM_DELETE_TEXT', { title: this.book.title }),
      showCancelButton: true,
      confirmButtonText: this.t('BOOKS.YES_DELETE'),
      cancelButtonText: this.t('COMMON.CANCEL')
    }).then(result => {
      if (!result.isConfirmed || !this.book?.id) return;

      this.deleting = true;
      this.message = null;

      this.books.deleteBook(this.book.id).pipe(
        finalize(() => this.deleting = false)
      ).subscribe({
        next: () => {
          this.toast.fire({ icon: 'success', title: this.t('BOOKS.DELETE_SUCCESS') });
          this.router.navigate(['../'], {
            relativeTo: this.route,
            queryParams: { deleted: '1' }
          });
        },
        error: (err: HttpErrorResponse) => {
          const text =
            typeof err?.error === 'string' ? err.error :
            err?.error?.message || this.t('BOOKS.DELETE_FAILED');
          Swal.fire({ icon: 'error', title: this.t('COMMON.ERROR'), text });
          console.error('Delete error', err);
        }
      });
    });
  }

  importCoverFromUrl() {
    const id = this.book?.id;
    const url = this.draft?.coverUrl ?? '';
    if (!id || !url.startsWith('http')) return;

    this.saving = true;
    this.books.uploadCoverFromUrl(id, url).subscribe({
      next: () => {
        this.saving = false;
        this.message = { type: 'success', text: this.t('BOOKS.COVER_IMPORTED') };
        const img = document.querySelector<HTMLImageElement>('img.book-cover');
        if (img) img.src = `/api/books/${id}/cover?ts=${Date.now()}`;
      },
      error: (err) => {
        this.saving = false;
        this.message = { type: 'error', text: err?.error?.message || this.t('BOOKS.COVER_IMPORT_FAILED') };
      }
    });
  }

  get coverUrl(): string {
    const id = this.book?.id;
    if (!id) return this.PLACEHOLDER;
    const ts = this.book?.dateUpdated ? Date.parse(this.book.dateUpdated) : Date.now();
    return `/api/books/${id}/cover?ts=${ts}`;
  }

  onImgError(ev: Event) {
    const img = ev.target as HTMLImageElement;
    if (img.src.includes(this.PLACEHOLDER)) return;
    img.src = this.PLACEHOLDER;
  }

  usePlaceholder(ev: Event) {
    (ev.target as HTMLImageElement).src = 'assets/book-placeholder.png';
  }

  selectedCoverFile?: File | null = null;
  uploadingCover = false;

  onCoverFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const maxBytes = 5 * 1024 * 1024; // 5MB

    if (!file) {
      this.selectedCoverFile = null;
      return;
    }
    if (!allowed.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: this.t('COMMON.ERROR'),
        text: this.t('BOOKS.COVER_UNSUPPORTED_TYPE') || 'Unsupported image type. Allowed: JPG, PNG, WEBP.'
      });
      this.selectedCoverFile = null;
      input.value = '';
      return;
    }
    if (file.size > maxBytes) {
      Swal.fire({
        icon: 'error',
        title: this.t('COMMON.ERROR'),
        text: this.t('BOOKS.COVER_TOO_LARGE') || 'File is larger than 5MB.'
      });
      this.selectedCoverFile = null;
      input.value = '';
      return;
    }

    this.selectedCoverFile = file;
    this.autoUploadCover(input);
  }

  private autoUploadCover(inputEl?: HTMLInputElement) {
    if (!this.book?.id || !this.selectedCoverFile || this.uploadingCover) return;

    this.uploadingCover = true;
    this.message = null;

    this.books.uploadCover(this.book.id, this.selectedCoverFile).pipe(
      finalize(() => this.uploadingCover = false)
    ).subscribe({
      next: () => {
        this.selectedCoverFile = null;
        if (inputEl) inputEl.value = '';

        this.toast.fire({ icon: 'success', title: this.t('BOOKS.COVER_UPLOADED') || 'Cover uploaded' });
        this.message = { type: 'success', text: this.t('BOOKS.COVER_UPLOADED') };

        const img = document.querySelector<HTMLImageElement>('img.book-cover');
        if (img) {
          const base = `/api/books/${this.book!.id!}/cover`;
          img.src = `${base}?ts=${Date.now()}`;
        }

        this.book = {
          ...(this.book as Book),
          dateUpdated: new Date().toISOString()
        };
      },
      error: (err) => {
        const text =
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : this.t('BOOKS.COVER_UPLOAD_FAILED') || 'Cover upload failed.');
        this.message = { type: 'error', text };
        Swal.fire({ icon: 'error', title: this.t('COMMON.ERROR'), text });
        console.error('Upload cover error', err);
      }
    });
  }

  // ---- Members API ----
  getAllMembers() {
    this.memberService.getAllMembers().subscribe({
      next: (members: Member[]) => (this.members = members),
      error: (error: HttpErrorResponse) => {
        console.error('Error loading members:', error.message);
        Swal.fire({ icon: 'error', title: this.t('COMMON.ERROR'), text: this.t('MEMBERS.LIST_LOAD_FAILED') });
      }
    });
  }

  get filteredMembers(): Member[] {
    const q = this.memberQuery.trim().toLowerCase();
    if (!q) return this.members;
    return this.members.filter(m =>
      (m.fullName || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q)
    );
  }

  get selectedMemberLabel(): string {
    const m = this.members.find(x => x.id === this.selectedMemberId);
    return m ? (m.fullName || m.email || '') : '';
  }

  chooseMember(m: Member) {
    this.selectedMemberId = m?.id ?? null;
  }


  // keep your filteredMembers + chooseMember(...) from earlier

  private reloadBook() {
    if (!this.book?.id) return;
    this.books.getBookDetail(this.book.id).subscribe({
      next: (b) => { this.book = b; },
      error: () => { /* ignore or show toast */ }
    });
  }

  onBorrow(): void {
    if (this.borrowing) return;
    this.borrowing = true;

    const memberId = this.isMember
      ? JSON.parse(localStorage.getItem('user') || 'null')?.id
      : this.selectedMemberId;

    if (!this.book?.id || !memberId) {
      this.borrowError = this.t('MEMBERS.BORROW_MISSING_SELECTION') || 'Select a member first.';
      this.borrowing = false;
      return;
    }

    this.borrowing = true;
    this.loans.createLoan(memberId, this.book.id, this.selectedNumberOfDays)
      .subscribe({
        next: (loan) => {
          this.borrowing = false;
          this.currentLoan = loan;
          this.reloadBook();             // <-- pull fresh total/available from server
          this.borrowSuccess = this.t('MEMBERS.BORROW_SUCCESS') || 'Borrowed successfully.';
          this.toast.fire({ icon: 'success', title: this.borrowSuccess });
        },
        error: (err) => {
          this.borrowing = false;
          this.borrowError = this.t('MEMBERS.BORROW_FAILED') || 'Borrow failed.';
          Swal.fire({ icon: 'error', title: this.t('COMMON.ERROR'), text: this.borrowError });
          console.error('Borrow error', err);
        }
      });
  }

  // Normalize snake/camel
  asTotal(b: any): number  { return b?.totalCopies ?? b?.total_copies ?? 0; }
  asAvail(b: any): number  { return b?.availableCopies ?? b?.available_copies ?? 0; }

  // Current active loans from server values
  activeLoans(b: any): number { return Math.max(0, this.asTotal(b) - this.asAvail(b)); }

  // Effective numbers for the UI (use draft total while editing)
  effTotal(b: any): number {
    return this.editMode ? (this.draft?.totalCopies ?? 0) : this.asTotal(b);
  }
  effAvail(b: any): number {
    return this.editMode
      ? Math.max(0, (this.draft?.totalCopies ?? 0) - this.activeLoans(b))
      : this.asAvail(b);
  }

  // Exact same status keys/classes as overview
  statusKey(b: any): string {
    const t = this.effTotal(b), a = this.effAvail(b);
    if (t === 0) return 'BOOKS.OUT_OF_STOCK';  // yellow
    if (a === 0) return 'BOOKS.LOANED_OUT';    // red
    return 'BOOKS.AVAILABLE';                  // green
  }
  badgeClass(b: any): string {
    const t = this.effTotal(b), a = this.effAvail(b);
    if (t === 0) return 'bg-warning text-dark'; // Out of stock -> yellow
    if (a === 0) return 'bg-danger';            // Loaned out -> red
    return 'bg-success';                         // Available -> green
  }


}

