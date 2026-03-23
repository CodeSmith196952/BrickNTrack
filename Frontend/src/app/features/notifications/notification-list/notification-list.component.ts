import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationState } from '../../../core/state/notification.state';
import { Notification } from '../../../core/models';

@Component({
  selector: 'app-notification-list',
  template: `
    <div class="notifications-container">
      <div class="header">
        <h2>Notifications</h2>
        <button class="btn-link" (click)="markAllRead()">Mark all as read</button>
      </div>
      <div *ngFor="let n of notifications" class="notification-item" [class.unread]="!n.isRead" (click)="markRead(n)">
        <div class="notif-icon">
          <i [class]="getIcon(n.type)"></i>
        </div>
        <div class="notif-content">
          <strong>{{ n.title }}</strong>
          <p>{{ n.body }}</p>
          <span class="time">{{ n.createdDate | date:'medium' }}</span>
        </div>
      </div>
      <div *ngIf="notifications.length === 0" class="no-data">No notifications</div>
    </div>
  `,
  styles: [`
    .notifications-container { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .btn-link { background: none; border: none; color: #1976d2; cursor: pointer; }
    .notification-item { display: flex; padding: 12px; border-bottom: 1px solid #eee; cursor: pointer; }
    .notification-item.unread { background: #e8f0fe; }
    .notification-item:hover { background: #f5f5f5; }
    .notif-content { flex: 1; margin-left: 12px; }
    .notif-content strong { display: block; }
    .notif-content p { margin: 4px 0; font-size: 14px; color: #666; }
    .time { font-size: 12px; color: #999; }
    .no-data { text-align: center; padding: 40px; color: #999; }
  `]
})
export class NotificationListComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private destroy$ = new Subject<void>();

  constructor(private notificationState: NotificationState) {}

  ngOnInit(): void {
    this.notificationState.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => this.notifications = notifications);
    this.notificationState.loadNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  markRead(n: Notification): void {
    if (!n.isRead) {
      this.notificationState.markAsRead(n.id);
    }
  }

  markAllRead(): void {
    this.notificationState.markAllRead();
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = { message: 'pi pi-envelope', booking: 'pi pi-calendar', review: 'pi pi-star', system: 'pi pi-info-circle' };
    return icons[type] || 'pi pi-bell';
  }
}
