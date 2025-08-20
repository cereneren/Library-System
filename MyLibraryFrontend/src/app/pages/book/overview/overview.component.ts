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
  }

  clearQuery() {
    this.query = '';
    this.search$.next('');
  }

  // Call this when a checkbox changes
  onToggleFilters() {
    this.filteredBooks = this.filterBooks(this.query.trim().toLowerCase());
  }

  getAllBooks() {
    this.loading = true;
    this.bookService.getAllBooks().subscribe({
      next: (books: Book[]) => {
        this.books = books ?? [];
        // initialize with current query + filters
        this.filteredBooks = this.filterBooks(this.query.trim().toLowerCase());
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading books:', error.message);
        this.errorKey = 'BOOKS.LOAD_FAILED';
        this.loading = false;
      }
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
}
