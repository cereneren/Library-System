// src/app/pages/loan/loan.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Loan {
  id: number;
  loanDate: string;
  dueDate: string;
  returnDate?: string | null;
  book: { id: number; title: string };
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
    return this.http.get<Loan>(`${this.base}/api/loans/${id}`);
  }

  createLoan(memberId: number, bookId: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.base}/api/loans`, { memberId, bookId });
  }

  returnLoan(id: number): Observable<string> {
    // If your backend returns plain text ("Book successfully returned")
    return this.http.post(`${this.base}/api/loans/${id}/return`, {}, { responseType: 'text' });
  }

  deleteLoan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/loans/${id}`);
  }
}
