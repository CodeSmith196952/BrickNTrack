import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="star-rating">
      <span *ngFor="let star of stars; let i = index"
            class="star"
            [class.filled]="i < (hoverRating || rating)"
            [class.readonly]="readonly"
            (click)="!readonly && setRating(i + 1)"
            (mouseenter)="!readonly && (hoverRating = i + 1)"
            (mouseleave)="!readonly && (hoverRating = 0)">
        &#9733;
      </span>
      <span class="rating-text" *ngIf="showText">{{ rating }}/{{ maxRating }}</span>
    </div>
  `,
  styles: [`
    .star-rating { display: inline-flex; align-items: center; gap: 2px; }
    .star { font-size: 24px; color: #ddd; cursor: pointer; transition: color 0.2s; }
    .star.filled { color: #ffc107; }
    .star.readonly { cursor: default; }
    .rating-text { margin-left: 8px; font-size: 14px; color: #666; }
  `]
})
export class StarRatingComponent {
  @Input() rating = 0;
  @Input() maxRating = 5;
  @Input() readonly = false;
  @Input() showText = false;
  @Output() ratingChange = new EventEmitter<number>();

  hoverRating = 0;
  stars: number[] = [];

  ngOnInit(): void {
    this.stars = Array(this.maxRating).fill(0);
  }

  setRating(rating: number): void {
    this.rating = rating;
    this.ratingChange.emit(rating);
  }
}
