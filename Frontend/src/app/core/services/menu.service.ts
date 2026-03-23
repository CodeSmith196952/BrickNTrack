import { Injectable } from '@angular/core';

export interface MenuItem {
  link: string;
  icon: string;
  menu: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  getMenuForRole(role: string): MenuItem[] {
    const common: MenuItem[] = [
      { link: '/dashboard', icon: 'layout', menu: 'Dashboard' }
    ];

    switch (role) {
      case 'Admin':
        return [
          ...common,
          { link: '/property/explore', icon: 'search', menu: 'Explore Properties' },
          {
            icon: 'users', menu: 'Admin', link: '', expanded: false,
            children: [
              { link: '/admin/users', icon: 'user-plus', menu: 'User Management' },
              { link: '/admin/moderation', icon: 'shield', menu: 'Moderation' },
              { link: '/admin/analytics', icon: 'bar-chart-2', menu: 'Analytics' }
            ]
          },
          {
            icon: 'briefcase', menu: 'Master', link: '', expanded: false,
            children: [
              { link: '/builder/list', icon: 'home', menu: 'Builder Master' },
              { link: '/project/list', icon: 'grid', menu: 'Project Master' }
            ]
          },
          { link: '/property/add', icon: 'plus-circle', menu: 'Add Property' },
          { link: '/messaging', icon: 'message-square', menu: 'Messages' },
          { link: '/notifications', icon: 'bell', menu: 'Notifications' },
          { link: '/booking/manage', icon: 'calendar', menu: 'Bookings' },
        ];

      case 'Builder':
        return [
          ...common,
          { link: '/property/explore', icon: 'search', menu: 'Explore Properties' },
          {
            icon: 'briefcase', menu: 'Master', link: '', expanded: false,
            children: [
              { link: '/builder/list', icon: 'home', menu: 'Builder Master' },
              { link: '/project/list', icon: 'grid', menu: 'Project Master' }
            ]
          },
          { link: '/property/add', icon: 'plus-circle', menu: 'Add Property' },
          { link: '/cost-monitoring', icon: 'dollar-sign', menu: 'Cost Monitoring' },
          { link: '/progress-tracker', icon: 'trending-up', menu: 'Progress Tracker' },
          { link: '/messaging', icon: 'message-square', menu: 'Messages' },
          { link: '/notifications', icon: 'bell', menu: 'Notifications' },
          { link: '/booking/manage', icon: 'calendar', menu: 'Bookings' },
          { link: '/reviews', icon: 'star', menu: 'Reviews' },
        ];

      case 'Buyer':
        return [
          ...common,
          { link: '/property/explore', icon: 'search', menu: 'Explore Properties' },
          { link: '/saved-properties', icon: 'heart', menu: 'Saved Properties' },
          { link: '/recently-viewed', icon: 'clock', menu: 'Recently Viewed' },
          { link: '/property/compare', icon: 'grid', menu: 'Compare Properties' },
          { link: '/booking/my-bookings', icon: 'calendar', menu: 'My Bookings' },
          { link: '/messaging', icon: 'message-square', menu: 'Messages' },
          { link: '/notifications', icon: 'bell', menu: 'Notifications' },
          { link: '/reviews', icon: 'star', menu: 'My Reviews' },
        ];

      default:
        return common;
    }
  }
}
