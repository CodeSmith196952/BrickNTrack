import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-booking-form',
  template: `
    <div class="booking-form">
      <h2>Book Property</h2>
      <div class="form-group">
        <label>Booking Amount</label>
        <input type="number" [(ngModel)]="booking.bookingAmount" placeholder="Enter amount">
      </div>
      <div class="form-group">
        <label>Payment Mode</label>
        <select [(ngModel)]="booking.paymentMode">
          <option value="">Select</option>
          <option value="Cash">Cash</option>
          <option value="Cheque">Cheque</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="UPI">UPI</option>
        </select>
      </div>
      <div class="form-group">
        <label>Transaction ID</label>
        <input type="text" [(ngModel)]="booking.transactionId" placeholder="Enter transaction ID">
      </div>
      <div class="form-group">
        <label>Notes</label>
        <textarea [(ngModel)]="booking.notes" rows="3" placeholder="Any additional notes"></textarea>
      </div>
      <button class="btn-submit" (click)="submit()">Submit Booking</button>
    </div>
  `,
  styles: [`
    .booking-form { padding: 20px; max-width: 600px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 4px; font-weight: 500; }
    .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .btn-submit { padding: 10px 24px; background: #1976d2; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
  `]
})
export class BookingFormComponent implements OnInit {
  booking = { projectId: 0, bookingAmount: 0, paymentMode: '', transactionId: '', notes: '' };

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.booking.projectId = +this.route.snapshot.params['projectId'];
  }

  submit(): void {
    this.api.post('Booking', this.booking).subscribe(res => {
      if (res.success) this.router.navigate(['/booking/my-bookings']);
    });
  }
}
