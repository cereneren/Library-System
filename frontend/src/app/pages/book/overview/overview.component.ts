import { Component, OnInit }         from '@angular/core';
import { BookService }             from '../book.service';
import { Book }                    from '../book';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-book-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  books: Book[] = [];

  public apiUrl = environment.apiUrl;

  ngOnInit(): void{
    this.getAllBooks();
  }

  constructor(public bookService: BookService) {}

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
