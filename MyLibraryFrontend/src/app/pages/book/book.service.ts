import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams  } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Book } from './book';
import { environment } from '../../../environments/environment';
import { Loan } from '../loan/loan'

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private api = environment.apiUrl;
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

  createBook(book: Partial<Book>): Observable<Book> {
    return this.http.post<Book>('/api/books', book);  // no change here
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

  uploadCover(id: number, file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.put(`${this.api}/api/books/${id}/cover`, form, { responseType: 'text' });
  }

  uploadCoverFromUrl(id: number, url: string) {
    const params = new HttpParams().set('url', url);
    return this.http.put(`/api/books/${id}/cover-url`, null, { params, responseType: 'text' });
  }

  getBookLoans(id: number) {
    return this.http.get<Loan[]>(`/api/members/${id}/loans`);
  }
}
