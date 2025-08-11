import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Member, MemberCreateRequest } from './member';
import { Loan } from '../loan/loan';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http: HttpClient) { }

  getAllMembers(): Observable<Member[]> {
    return this.http.get<Member[]>('./api/members').pipe(
      catchError(this.handleError)
    );
  }

  getMemberDetail(id: number): Observable<Member> {
    return this.http.get<Member>(`./api/members/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateMember(member: Member) {
    const body = { fullName: member.fullName, email: member.email };
    console.log('PUT /api/members/%s payload:', member.id, body);
    return this.http.put(`/api/members/${member.id}`, body);
  }

  createMember(member: MemberCreateRequest): Observable<Member> {
    return this.http.post<Member>('./api/members', member).pipe(
      catchError(this.handleError)
    );
  }

  deleteMember(id: number) {
    // Use /api not ./api if you’re proxying
    return this.http.delete(`/api/members/${id}`, {
      responseType: 'text' as const
    });
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

  getMemberLoans(memberId: number) {
    return this.http.get<Loan[]>(`/api/members/${memberId}/loans`);
  }

  returnLoan(loanId: number) {
    return this.http.post(`/api/loans/${loanId}/return`, null, {
      responseType: 'text' //
    });
  }
}
