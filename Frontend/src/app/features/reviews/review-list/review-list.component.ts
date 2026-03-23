import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Review } from '../../../core/models';

@Component({
  selector: 'app-review-list',
  template: `
    <div class="review-list">
      <h3 *ngIf="!projectId">All Reviews</h3>
      <div *ngFor="let r of reviews" class="review-item">
        <div class="review-header">
          <strong>{{ r.buyerUserName }}</strong>
          <app-star-rating [rating]="r.overallRating" [readonly]="true"></app-star-rating>
          <span class="date">{{ r.createdDate | date:'mediumDate' }}</span>
        </div>
        <p *ngIf="r.reviewText">{{ r.reviewText }}</p>
        <div class="sub-ratings" *ngIf="r.qualityRating || r.valueRating || r.locationRating">
          <span *ngIf="r.qualityRating">Quality: {{ r.qualityRating }}/5</span>
          <span *ngIf="r.valueRating">Value: {{ r.valueRating }}/5</span>
          <span *ngIf="r.locationRating">Location: {{ r.locationRating }}/5</span>
        </div>
        <div class="builder-response" *ngIf="r.builderResponse">
          <strong>Builder Response:</strong>
          <p>{{ r.builderResponse }}</p>
        </div>
      </div>
      <div *ngIf="reviews.length === 0" class="no-data">No reviews yet</div>
    </div>
  `,
  styles: [`
    .review-list { padding: 16px; }
    .review-item { padding: 16px; border-bottom: 1px solid #eee; }
    .review-header { display: flex; align-items: center; gap: 12px; }
    .date { font-size: 12px; color: #999; margin-left: auto; }
    .sub-ratings { display: flex; gap: 16px; font-size: 13px; color: #666; margin-top: 8px; }
    .builder-response { margin-top: 12px; padding: 12px; background: #f5f5f5; border-radius: 4px; }
    .no-data { text-align: center; padding: 40px; color: #999; }
  `]
})
export class ReviewListComponent implements OnInit {
  @Input() projectId?: number;
  reviews: Review[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    if (this.projectId) {
      this.api.get<Review[]>(`Review/project/${this.projectId}`).subscribe(res => {
        if (res.success && res.data) this.reviews = res.data;
      });
    }
  }
}
