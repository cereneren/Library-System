import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from './book';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  private apiUrl = 'http://localhost:8080/api/recommendations';

  constructor(private http: HttpClient) {}

  getRecommendations(memberId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/member/${memberId}`);
  }
}
