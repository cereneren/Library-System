import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Book } from '../book';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-book-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'] // <-- plural
})
export class OverviewComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = []; // keep the array approach
  isMember = false;
  loading = false;

  pageSize = 9;
  currentPage = 1;

  // store the i18n key, use the |translate pipe in template
  errorKey?: string;

  private readonly PLACEHOLDER = 'assets/nocover.png';

  query = '';
  private search$ = new Subject<string>();

  public apiUrl = environment.apiUrl;

  // availability filters (assuming Book has boolean `available`)
  filters = {
    available: true,
    loanedOut: true
  };

  constructor(
    private bookService: BookService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.isMember = this.auth.isMember();
    this.setupSearch();
    this.getAllBooks();
  }

  private setupSearch() {
    this.search$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map(q => q.trim().toLowerCase())
      )
      .subscribe(q => {
        this.filteredBooks = this.filterBooks(q);
      });
  }

  onQueryChange(value: string) {
    this.search$.next(value || '');
    this.currentPage = 1;
  }

  clearQuery() {
    this.query = '';
    this.search$.next('');
  }

  // Call this when a checkbox changes
  onToggleFilters() {
    this.filteredBooks = this.filterBooks(this.query.trim().toLowerCase());
    this.currentPage = 1;
  }

  getAllBooks() {
    this.loading = true;
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books.sort(
          (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
        );
        this.filteredBooks = [...this.books];
      },
      error: (err) => console.error(err)
    });
  }

  private filterBooks(q: string): Book[] {
    // 1) filter by search
    let result = this.books;
    if (q) {
      result = result.filter(b => {
        const title  = (b.title  || '').toLowerCase();
        const author = (b.author || '').toLowerCase();
        return title.includes(q) || author.includes(q);
      });
    }

    // 2) filter by availability
    result = result.filter(b => {
      const isAvailable = !!b.available;
      const isLoanedOut = !isAvailable;

      return (isAvailable && this.filters.available)
          || (isLoanedOut && this.filters.loanedOut);
    });

    return result;
  }

  coverUrl(book: Book): string {
    if (!book?.id) return this.PLACEHOLDER;
    const ts = (book as any).dateUpdated ? Date.parse((book as any).dateUpdated) : Date.now();
    return `/api/books/${book.id}/cover?ts=${ts}`;
  }

  onImgError(ev: Event) {
    const img = ev.target as HTMLImageElement;
    if (img.src.includes(this.PLACEHOLDER)) return; // avoid loop
    img.src = this.PLACEHOLDER;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredBooks.length / this.pageSize));
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedBooks() {
    // clamp currentPage if data size changed (filters/search)
    const clamped = Math.min(this.currentPage, this.totalPages);
    if (clamped !== this.currentPage) this.currentPage = clamped;

    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBooks.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;

    // scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


}
