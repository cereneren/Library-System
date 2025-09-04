import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Book } from '../book/book';
import { Member } from '../member/member';
import { Loan } from './loan'

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

  getLoansForBook(bookId: number): Observable<Loan[]> {
    return this.http.get<Loan[]>(`/api/books/${bookId}/loans`);
  }

  getLoanDetail(id: number): Observable<Loan> {
    return this.http.get<Loan>(`/api/loans/${id}`);
  }

  createLoan(memberId: number, bookId: number, numberOfDays: number): Observable<Loan> {
    return this.http.post<Loan>(`/api/loans`, { memberId, bookId, numberOfDays});
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
