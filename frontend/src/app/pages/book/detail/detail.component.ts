import { Component, OnInit } from '@angular/core';
import { BookService }             from '../book.service';
import { Book }                    from '../book';
import {ActivatedRoute}            from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  public apiUrl = environment.apiUrl;
  book: Book = {id: 0, title: '', author: '', available: false};

    // Inject ActivatedRoute
    constructor(
      private bookService: BookService,
      private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
      // Get ID from route parameters
      const id = this.route.snapshot.paramMap.get('id');

      if (id) {
        this.loadBook(parseInt(id, 10));
      } else {
        console.error('No book ID provided in route');
      }
    }

    loadBook(id: number): void {
      this.bookService.getBookDetail(id).subscribe({
        next: (book: Book) => {
          this.book = book;
        },
        error: (error) => {
          console.error('Error loading book:', error);
          // Handle error (e.g., show message to user)
        }
      });
    }
}
