import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ServiceResult<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  errors: string[];
  data?: T;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl: string;
  private readonly requestTimeout = 30000;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  get<T>(route: string, params?: { [key: string]: any }): Observable<ServiceResult<T>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const val = params[key];
        if (val !== null && val !== undefined && val !== '') {
          httpParams = httpParams.set(key, String(val));
        }
      });
    }
    return this.http.get<ServiceResult<T>>(`${this.baseUrl}/${route}`, { params: httpParams })
      .pipe(timeout(this.requestTimeout), catchError(this.handleError));
  }

  post<T>(route: string, data: any): Observable<ServiceResult<T>> {
    return this.http.post<ServiceResult<T>>(`${this.baseUrl}/${route}`, data)
      .pipe(timeout(this.requestTimeout), catchError(this.handleError));
  }

  postForm<T>(route: string, formData: FormData): Observable<ServiceResult<T>> {
    return this.http.post<ServiceResult<T>>(`${this.baseUrl}/${route}`, formData)
      .pipe(timeout(this.requestTimeout), catchError(this.handleError));
  }

  put<T>(route: string, data?: any): Observable<ServiceResult<T>> {
    return this.http.put<ServiceResult<T>>(`${this.baseUrl}/${route}`, data)
      .pipe(timeout(this.requestTimeout), catchError(this.handleError));
  }

  delete<T>(route: string, params?: { [key: string]: any }): Observable<ServiceResult<T>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const val = params[key];
        if (val !== null && val !== undefined && val !== '') {
          httpParams = httpParams.set(key, String(val));
        }
      });
    }
    return this.http.delete<ServiceResult<T>>(`${this.baseUrl}/${route}`, { params: httpParams })
      .pipe(timeout(this.requestTimeout), catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let message = 'An unexpected error occurred';
    if (error.name === 'TimeoutError') {
      message = 'Request timed out. Please try again.';
    } else if (error.status === 0) {
      message = 'Unable to connect to server. Please check your connection.';
    } else if (error.error?.message) {
      message = error.error.message;
    } else if (error.statusText) {
      message = error.statusText;
    }
    return throwError(() => ({ ...error, friendlyMessage: message }));
  }
}
