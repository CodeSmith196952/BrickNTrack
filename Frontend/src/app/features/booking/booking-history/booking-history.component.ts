import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { PropertyBooking } from '../../../core/models';

@Component({
  selector: 'app-booking-history',
  template: `
    <div class="booking-history">
      <h2>{{ isBuilder ? 'Booking Management' : 'My Bookings' }}</h2>
      <p-table [value]="bookings" [paginator]="true" [rows]="10" styleClass="p-datatable-sm">
        <ng-template pTemplate="header">
          <tr>
            <th>Property</th>
            <th *ngIf="isBuilder">Buyer</th>
            <th>Amount</th>
            <th>Payment Mode</th>
            <th>Status</th>
            <th>Date</th>
            <th *ngIf="isBuilder">Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-b>
          <tr>
            <td>{{ b.projectName }}</td>
            <td *ngIf="isBuilder">{{ b.buyerUserName }}</td>
            <td>{{ b.bookingAmount | number }}</td>
            <td>{{ b.paymentMode }}</td>
            <td><span [class]="'status-' + b.paymentStatus.toLowerCase()">{{ b.paymentStatus }}</span></td>
            <td>{{ b.createdDate | date:'mediumDate' }}</td>
            <td *ngIf="isBuilder">
              <button class="btn-sm" (click)="updateStatus(b.id, 'Confirmed')">Confirm</button>
              <button class="btn-sm reject" (click)="updateStatus(b.id, 'Rejected')">Reject</button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
    .booking-history { padding: 20px; }
    .btn-sm { padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; margin-right: 4px; background: #4caf50; color: #fff; font-size: 12px; }
    .btn-sm.reject { background: #f44336; }
    .status-pending { color: #ff9800; }
    .status-confirmed { color: #4caf50; }
    .status-rejected { color: #f44336; }
  `]
})
export class BookingHistoryComponent implements OnInit {
  bookings: PropertyBooking[] = [];
  isBuilder = false;

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    const role = this.auth.getUserRole();
    this.isBuilder = role === 'Builder' || role === 'Admin';
    this.loadBookings();
  }

  loadBookings(): void {
    if (this.isBuilder) {
      // For builders, we need to load bookings across their projects
      // Using the API that returns bookings for a specific project or all
      this.api.get<PropertyBooking[]>('Booking/my-bookings').subscribe({
        next: (res) => {
          if (res.success && res.data) this.bookings = res.data;
        },
        error: () => {}
      });
    } else {
      this.api.get<PropertyBooking[]>('Booking/my-bookings').subscribe({
        next: (res) => {
          if (res.success && res.data) this.bookings = res.data;
        },
        error: () => {}
      });
    }
  }

  updateStatus(id: number, status: string): void {
    this.api.put<any>(`Booking/${id}/status?status=${status}`).subscribe({
      next: () => this.loadBookings(),
      error: () => {}
    });
  }
}
