import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReviewRequest {
  bookId: number;
  memberId: number;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  comment: string;
  bookId: number;
  memberId: number;
  memberName: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) {}

  addReview(review: ReviewRequest): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(this.apiUrl, review);
  }

  getReviewsByBook(bookId: number): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${this.apiUrl}/book/${bookId}`);
  }

  getAverageRating(bookId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/book/${bookId}/average`);
  }
}
