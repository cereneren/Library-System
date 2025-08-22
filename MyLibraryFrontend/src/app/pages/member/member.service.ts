import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Member, MemberCreateRequest } from './member';
import { Loan } from '../loan/loan';

@Injectable({ providedIn: 'root' })
export class MemberService {
  constructor(private http: HttpClient) {}

  getAllMembers(): Observable<Member[]> {
    return this.http.get<Member[]>('/api/members').pipe(catchError(this.handleError));
  }

  getMemberDetail(id: number): Observable<Member> {
    return this.http.get<Member>(`/api/members/${id}`).pipe(catchError(this.handleError));
  }

  updateMember(payload: { id: number; fullName: string; email: string }): Observable<HttpResponse<Member>> {
    const body = { fullName: payload.fullName, email: payload.email };
    console.log('PUT /api/members/%s payload:', payload.id, body);

    // use /api (not ./api) when running via Angular proxy
    return this.http.put<Member>(`/api/members/${payload.id}`, body, { observe: 'response' });
  }

  createMember(member: MemberCreateRequest): Observable<Member> {
    return this.http.post<Member>('/api/auth/signup', member).pipe(catchError(this.handleError));
  }

  deleteMember(id: number) {
    return this.http.delete(`/api/members/${id}`, { responseType: 'text' as const });
  }

  private handleError(error: HttpErrorResponse) {
    const msg = error.error instanceof ErrorEvent
      ? `Error: ${error.error.message}`
      : `Error Code: ${error.status}\nMessage: ${error.message}`;
    console.error(msg);
    return throwError(() => new Error(msg));
  }

  getMemberLoans(memberId: number) {
    return this.http.get<Loan[]>(`/api/members/${memberId}/loans`);
  }

  returnLoan(loanId: number) {
    return this.http.post(`/api/loans/${loanId}/return`, null, { responseType: 'text' });
  }
}
