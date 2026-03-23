import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const expectedRoles = route.data['roles'] as string[];
    if (!expectedRoles || expectedRoles.length === 0) return true;

    const userRole = this.auth.getUserRole();
    if (expectedRoles.includes(userRole)) return true;

    this.router.navigate(['/']);
    return false;
  }
}
