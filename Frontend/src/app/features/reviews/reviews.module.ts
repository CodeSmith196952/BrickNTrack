import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ReviewListComponent } from './review-list/review-list.component';
import { ReviewFormComponent } from './review-form/review-form.component';

const routes: Routes = [
  { path: '', component: ReviewListComponent },
  { path: 'create/:projectId', component: ReviewFormComponent }
];

@NgModule({
  declarations: [ReviewListComponent, ReviewFormComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class ReviewsModule {}
