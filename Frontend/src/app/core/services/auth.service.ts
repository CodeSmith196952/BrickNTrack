import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { parseJwt, isTokenExpired, clearJwtCache } from '../utils/jwt.utils';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserToken {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  role: string;
  jwtToken: string;
  refreshToken: string;
}

const TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'refresh-token';
const USER_KEY = 'auth-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserToken | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private api: ApiService, private router: Router) {}

  login(request: LoginRequest): Observable<UserToken | null> {
    return this.api.post<UserToken>('UserManager/login', request).pipe(
      map(result => {
        if (result.success && result.data) {
          this.saveSession(result.data);
          return result.data;
        }
        return null;
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.api.post('UserManager/AddUser', userData);
  }

  refreshToken(): Observable<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return of(null);
    }

    return this.api.post<any>('UserManager/RefreshToken', { refreshToken }).pipe(
      map(result => {
        if (result.success && result.data?.jwtToken) {
          sessionStorage.setItem(TOKEN_KEY, result.data.jwtToken);
          sessionStorage.setItem(REFRESH_TOKEN_KEY, result.data.refreshToken);
          return result.data.jwtToken;
        }
        return null;
      }),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  logout(): void {
    clearJwtCache();
    sessionStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !isTokenExpired(this.getToken());
  }

  isTokenExpired(): boolean {
    return !this.isLoggedIn();
  }

  getCurrentUser(): UserToken | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string {
    const user = this.getStoredUser();
    if (user?.role) return user.role;
    const payload = parseJwt(this.getToken());
    return payload?.role || '';
  }

  getUserDisplayName(): string {
    const user = this.getStoredUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  getUserId(): number {
    const payload = parseJwt(this.getToken());
    return parseInt(payload?.userId || '0');
  }

  getBuilderId(): number {
    const payload = parseJwt(this.getToken());
    return parseInt(payload?.builderId || '0');
  }

  private saveSession(user: UserToken): void {
    sessionStorage.setItem(TOKEN_KEY, user.jwtToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, user.refreshToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getStoredUser(): UserToken | null {
    const data = sessionStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  }
}
