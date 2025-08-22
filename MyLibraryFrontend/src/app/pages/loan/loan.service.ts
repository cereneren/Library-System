import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Book } from '../book/book';

export interface Loan {
  id: number;
  loanDate: string;
  dueDate: string;
  returnDate?: string | null;
  book: Book;
  member?: { id: number; fullName: string };
}

@Injectable({ providedIn: 'root' })
export class LoanService {
  private base = environment.apiUrl || ''; // '' when using proxy
  // If you don't want environments right now: private base = '';

  constructor(private http: HttpClient) {}

   getAllLoans(): Observable<Loan[]> {
      return this.http.get<Loan[]>('/api/loans');
    }

    getLoansForMember(memberId: number): Observable<Loan[]> {
      return this.http.get<Loan[]>(`/api/members/${memberId}/loans`);
    }

  getLoanDetail(id: number): Observable<Loan> {
    return this.http.get<Loan>(`/api/loans/${id}`);
  }

  createLoan(memberId: number, bookId: number): Observable<Loan> {
    return this.http.post<Loan>(`/api/loans`, { memberId, bookId });
  }

  returnLoan(id: number): Observable<string> {
    // If your backend returns plain text ("Book successfully returned")
    return this.http.post(`/api/loans/${id}/return`, {}, { responseType: 'text' });
  }

  getActiveLoanForBook(bookId: number): Observable<Loan | null> {
    return this.http
      .get<Loan | null>(`/api/books/${bookId}/loan`)
      .pipe(
        catchError((err: HttpErrorResponse) =>
          err.status === 404 ? of(null) : throwError(() => err)
        )
      );
  }
}
