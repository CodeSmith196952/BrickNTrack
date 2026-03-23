import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';

const routes: Routes = [
  { path: 'my-bookings', component: BookingHistoryComponent },
  { path: 'create/:projectId', component: BookingFormComponent },
  { path: 'manage', component: BookingHistoryComponent },
];

@NgModule({
  declarations: [BookingFormComponent, BookingHistoryComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class BookingModule {}
