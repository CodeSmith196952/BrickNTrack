import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { Notification } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationState {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);

  notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  unreadCount$: Observable<number> = this.notifications$.pipe(
    map(notifications => notifications.filter(n => !n.isRead).length)
  );

  constructor(private api: ApiService) {}

  loadNotifications(): void {
    this.api.get<Notification[]>('Notification').subscribe(res => {
      if (res.success && res.data) {
        this.notificationsSubject.next(res.data);
      }
    });
  }

  markAsRead(id: number): void {
    this.api.put(`Notification/${id}/read`).subscribe(() => {
      const current = this.notificationsSubject.value.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      );
      this.notificationsSubject.next(current);
    });
  }

  markAllRead(): void {
    this.api.put('Notification/read-all').subscribe(() => {
      const current = this.notificationsSubject.value.map(n => ({ ...n, isRead: true }));
      this.notificationsSubject.next(current);
    });
  }
}
