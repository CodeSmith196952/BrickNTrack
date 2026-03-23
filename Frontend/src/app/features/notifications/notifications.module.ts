import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';

const routes: Routes = [
  { path: '', component: NotificationListComponent },
  { path: 'settings', component: NotificationSettingsComponent }
];

@NgModule({
  declarations: [NotificationListComponent, NotificationSettingsComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class NotificationsModule {}
