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
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  isMember = false;
  loading = false;
  error?: string;

  query = '';
  private search$ = new Subject<string>();

  public apiUrl = environment.apiUrl;

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

  getAllBooks() {
    this.loading = true;
    this.bookService.getAllBooks().subscribe({
      next: (books: Book[]) => {
        this.books = books ?? [];
        // initialize filtered with current query (if any)
        this.filteredBooks = this.filterBooks(this.query.trim().toLowerCase());
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading books:', error.message);
        this.error = 'Failed to load books';
        this.loading = false;
      }
    });
  }

  private filterBooks(q: string): Book[] {
    if (!q) return this.books;
    return this.books.filter(b => {
      const title = (b.title || '').toLowerCase();
      const author = (b.author || '').toLowerCase();
      const isbn = (b as any).isbn ? String((b as any).isbn).toLowerCase() : '';
      return title.includes(q) || author.includes(q) || isbn.includes(q);
    });
  }
}
