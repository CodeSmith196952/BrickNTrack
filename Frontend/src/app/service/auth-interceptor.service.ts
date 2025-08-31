import Swal from 'sweetalert2';
import { catchError, throwError, BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { brickntrackService } from './brickntrack-service.service';
import { Router } from '@angular/router';
import { ServiceUrl } from './service-url.service';
import { TokenModel } from './user-model.service';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  public tokenModel: TokenModel = new TokenModel();
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    private brickntrackService: brickntrackService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let authReq = req;

    // ✅ Fetch token from session storage
    const token = sessionStorage.getItem('auth-token');

    if (token) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !authReq.url.includes(ServiceUrl.authenticate) &&
          error.status === 401
        ) {
          if (authReq.url.includes('refreshtoken')) {
            this.router.navigate(['/login']);
          }
          return this.handle401Error(authReq, next).pipe(
            catchError((authError) => throwError(() => authError))
          );
        }
        return throwError(() => error);
      })
    ) as Observable<HttpEvent<Object>>;
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token),
    });
  }
private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  if (!this.isRefreshing) {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    const refreshToken = sessionStorage.getItem('refresh-token');
    this.tokenModel.token = refreshToken || '';

    if (refreshToken) {
      return this.brickntrackService
        .post<any>(ServiceUrl.refreshToken, this.tokenModel)
        .pipe(
          switchMap((response) => {
            this.isRefreshing = false;

            if (response?.jwtToken) {
              sessionStorage.setItem('auth-token', response.jwtToken);
              sessionStorage.setItem('refresh-token', response.refreshToken);

              this.refreshTokenSubject.next(response.jwtToken);
              return next.handle(this.addTokenHeader(request, response.jwtToken));
            } else {
              this.router.navigate(['/login']);
              return throwError(() => 'Refresh failed');
            }
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.router.navigate(['/login']);
            return throwError(() => error);
          })
        );
    } else {
      this.router.navigate(['/login']);
    }
  }

  // If already refreshing, wait for the new token
  return this.refreshTokenSubject.pipe(
    switchMap((token: string | null) => {
      if (token) {
        return next.handle(this.addTokenHeader(request, token));
      } else {
        return throwError(() => 'Token refresh in progress failed.');
      }
    })
  );
}

}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
