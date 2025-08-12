import { Component, OnInit }         from '@angular/core';
import { BookService }             from '../book.service';
import { Book }                    from '../book';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-book-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  books: Book[] = [];
  isMember = false;
  loading = false;
  error?: string;

  public apiUrl = environment.apiUrl;

  constructor(
      private bookService: BookService,
      private auth: AuthService
    ) {}

    ngOnInit(): void {
      this.isMember = this.auth.isMember();     // hide Add for members
      this.getAllBooks();                        // load books
    }

  getAllBooks(){
    this.bookService.getAllBooks().subscribe({
      next: (books: Book[]) => {
        this.books = books;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading books:', error.message);
        // Handle error
      }
    });
  }

}
