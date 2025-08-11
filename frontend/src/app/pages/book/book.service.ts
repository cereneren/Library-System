import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Book } from './book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>('./api/books').pipe(
      catchError(this.handleError)
    );
  }

  getBookDetail(id: number): Observable<Book> {
    return this.http.get<Book>(`./api/books/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(`./api/books/${book.id}`, book).pipe(
      catchError(this.handleError)
    );
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>('./api/books', book).pipe(
      catchError(this.handleError)
    );
  }

  deleteBook(id: number): Observable<unknown> {
    return this.http.delete(`./api/books/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  uploadCoverFromUrl(id: number, url: string) {
    return this.http.post<void>(`/api/books/${id}/cover-from-url`, { url });
  }
}
