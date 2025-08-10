import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class IdleTimeoutService {
  private timeoutDuration = 15 * 60 * 1000; // 15 minutes
  private timeoutId: any;

  constructor(private router: Router, private ngZone: NgZone) {
    this.setupTimeoutReset();
  }

  private setupTimeoutReset() {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    events.forEach(event => {
      window.addEventListener(event, () => this.resetTimeout(), true);
    });

    this.startTimeout();
  }

  private startTimeout() {
    this.clearTimeout();
    this.timeoutId = setTimeout(() => {
      this.ngZone.run(() => this.promptLogout());
    }, this.timeoutDuration);
  }

  private resetTimeout() {
    this.startTimeout();
  }

  private clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private promptLogout() {
    Swal.fire({
      title: 'Session Expired',
      text: 'Your session has expired due to inactivity.',
      icon: 'warning',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
    }).then(() => {
      this.logoutUser();
    });
  }

  private logoutUser() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/vms']);
  }
}
