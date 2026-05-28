import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecommendationService } from '../../../book/recommendation.service';
import { Book } from '../../../book/book';
import { BookModule } from '../../../book/book.module';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, BookModule],
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.css'
})
export class RecommendationsComponent implements OnInit {

  recommendedBooks: Book[] = [];
  recommendationsLoading = false;
  recommendationsError?: string;

  constructor(
    private recommendationService: RecommendationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    const session = JSON.parse(localStorage.getItem('user') || 'null');

    if (!session?.id) {
      this.recommendationsError = 'Could not find member information.';
      return;
    }

    this.recommendationsLoading = true;
    this.recommendationsError = undefined;

    this.recommendationService.getRecommendations(session.id).subscribe({
      next: (books) => {
        this.recommendedBooks = books;
        this.recommendationsLoading = false;
      },
      error: () => {
        this.recommendationsError = 'Could not load recommendations.';
        this.recommendationsLoading = false;
      }
    });
  }

  viewBookDetails(bookId: number | undefined): void {
    if (!bookId) return;
    this.router.navigate(['/member/books', bookId, 'detail']);
  }
}
