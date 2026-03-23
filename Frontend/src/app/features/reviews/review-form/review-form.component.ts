import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-review-form',
  template: `
    <div class="review-form">
      <h2>Write a Review</h2>
      <div class="form-group">
        <label>Overall Rating</label>
        <app-star-rating [rating]="review.overallRating" (ratingChange)="review.overallRating = $event"></app-star-rating>
      </div>
      <div class="form-group">
        <label>Quality</label>
        <app-star-rating [rating]="review.qualityRating" (ratingChange)="review.qualityRating = $event"></app-star-rating>
      </div>
      <div class="form-group">
        <label>Value</label>
        <app-star-rating [rating]="review.valueRating" (ratingChange)="review.valueRating = $event"></app-star-rating>
      </div>
      <div class="form-group">
        <label>Location</label>
        <app-star-rating [rating]="review.locationRating" (ratingChange)="review.locationRating = $event"></app-star-rating>
      </div>
      <div class="form-group">
        <label>Your Review</label>
        <textarea [(ngModel)]="review.reviewText" rows="5" placeholder="Share your experience..."></textarea>
      </div>
      <button class="btn-submit" (click)="submit()">Submit Review</button>
    </div>
  `,
  styles: [`
    .review-form { padding: 20px; max-width: 600px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 4px; font-weight: 500; }
    textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .btn-submit { padding: 10px 24px; background: #1976d2; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
  `]
})
export class ReviewFormComponent implements OnInit {
  review = { projectId: 0, overallRating: 0, qualityRating: 0, valueRating: 0, locationRating: 0, reviewText: '' };

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.review.projectId = +this.route.snapshot.params['projectId'];
  }

  submit(): void {
    this.api.post('Review', this.review).subscribe(res => {
      if (res.success) this.router.navigate(['/property/info', this.review.projectId]);
    });
  }
}
