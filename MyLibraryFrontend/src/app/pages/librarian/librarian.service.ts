import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Librarian } from './librarian';

// pages/librarian/librarian.service.ts
@Injectable({ providedIn: 'root' })
export class LibrarianService {
  private apiUrl = '/api/users'; // or '/api/members' if that’s your controller

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<Librarian> {
    return this.http.get<Librarian>(`${this.apiUrl}/${id}`);
  }
}
