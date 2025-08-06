// src/app/features/auth/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

interface LoginResponse { token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private _token$ = new BehaviorSubject<string | null>(this.readToken());

  token$ = this._token$.asObservable();
  get token() { return this._token$.value; }
  get isLoggedIn() { return !!this.token; }

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<void> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => {
          localStorage.setItem('jwt', res.token);
          this._token$.next(res.token);
        }),
        map(() => void 0)
      );
  }

  logout() {
    localStorage.removeItem('jwt');
    this._token$.next(null);
  }

  private readToken(): string | null {
    return localStorage.getItem('jwt');
  }
}
