import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { MenuService, MenuItem } from '../../core/services/menu.service';
import { NotificationState } from '../../core/state/notification.state';
import { MessagingState } from '../../core/state/messaging.state';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit, OnDestroy {
  search = false;
  userDisplayName = '';
  userRole = '';
  sidebarMenu: MenuItem[] = [];
  currentDate: Date = new Date();
  unreadNotificationCount = 0;
  unreadMessageCount = 0;
  sidebarCollapsed = false;
  mobileMenuOpen = false;
  userMenuOpen = false;

  private destroy$ = new Subject<void>();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches), shareReplay());

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService,
    private menuService: MenuService,
    private notificationState: NotificationState,
    private messagingState: MessagingState
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.userDisplayName = this.authService.getUserDisplayName();
    this.sidebarMenu = this.menuService.getMenuForRole(this.userRole);

    // Subscribe to real-time notification count
    this.notificationState.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => this.unreadNotificationCount = count);

    // Subscribe to real-time unread message count
    this.messagingState.totalUnread$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => this.unreadMessageCount = count);

    // Load initial data
    this.notificationState.loadNotifications();
    this.messagingState.loadConversations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  Logout(): void {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
      }
    });
  }

  logout(): void {
    this.Logout();
  }
}
