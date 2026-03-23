import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-notification-settings',
  template: `
    <div class="settings-container">
      <h2>Notification Settings</h2>
      <div class="setting-item">
        <label>Email Notifications</label>
        <p-checkbox [(ngModel)]="settings.emailEnabled" [binary]="true"></p-checkbox>
      </div>
      <div class="setting-item">
        <label>SMS Notifications</label>
        <p-checkbox [(ngModel)]="settings.smsEnabled" [binary]="true"></p-checkbox>
      </div>
      <div class="setting-item">
        <label>Push Notifications</label>
        <p-checkbox [(ngModel)]="settings.pushEnabled" [binary]="true"></p-checkbox>
      </div>
      <div class="setting-item">
        <label>In-App Notifications</label>
        <p-checkbox [(ngModel)]="settings.inAppEnabled" [binary]="true"></p-checkbox>
      </div>
      <button class="btn-save" (click)="save()">Save Settings</button>
    </div>
  `,
  styles: [`
    .settings-container { padding: 20px; max-width: 500px; }
    .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee; }
    .btn-save { margin-top: 20px; padding: 10px 24px; background: #1976d2; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
  `]
})
export class NotificationSettingsComponent implements OnInit {
  settings = { emailEnabled: true, smsEnabled: false, pushEnabled: false, inAppEnabled: true };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<any>('Notification/settings').subscribe(res => {
      if (res.success && res.data) this.settings = res.data;
    });
  }

  save(): void {
    this.api.put('Notification/settings', this.settings).subscribe();
  }
}
