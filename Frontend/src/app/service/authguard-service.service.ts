import { Injectable } from '@angular/core';
import { TokenStroageService } from './token-stroage.service';
import { TokenModel, LoginResponse } from './user-model.service';
import { brickntrackService } from './brickntrack-service.service';
import { ServiceUrl } from './service-url.service';
import { DataService } from '../service/data.service';
import { Observable, catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthguardServiceService {
  public refreshToken: TokenModel = new TokenModel();

  constructor(
    private tokenStorage: TokenStroageService,
    private brickntrackService: brickntrackService,
    private dataService: DataService,
    private router: Router
  ) {}

  gettoken(): boolean {
    return !!this.tokenStorage.getToken();
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return expiry < now;
    } catch (e) {
      return true;
    }
  }

  tryRefreshingToken(): Observable<boolean> {
    const token = this.tokenStorage.getToken();

    if (token && !this.isTokenExpired(token)) {
      // Token is valid
      return of(true);
    }

    // Try refresh
    const refreshToken = this.tokenStorage.getRefreshToken();

    if (!refreshToken) {
      this.router.navigate(['/login']);
      return of(false);
    }

    const payload = { refreshToken };

    return this.brickntrackService.post<LoginResponse>(
      ServiceUrl.refreshToken,
      payload
    ).pipe(
      map((response) => {
        if (response?.jwtToken) {
          this.dataService.setUserDetail(response);
          this.tokenStorage.saveToken(response.jwtToken);
          this.tokenStorage.setRefreshToken(response.refreshToken);
          this.tokenStorage.saveUser(response);
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      }),
      catchError((error) => {
        console.error('Refresh failed:', error);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
