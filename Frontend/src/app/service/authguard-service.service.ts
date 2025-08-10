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
  private token: string | null = null;
  private tokenExpiration: Date | null = null;
  constructor(
    private tokenStorage: TokenStroageService,
    private brickntrackService: brickntrackService,
    private dataService: DataService,private router: Router,
  ) {}
 
  gettoken() {
    return !!this.tokenStorage.getToken();
  }
 
  getRefreshToken(): Observable<string | null> {
    const refreshToken = this.tokenStorage.getRefreshToken();
 
    if (refreshToken !== null) {
      this.refreshToken.token = refreshToken;

      return this.brickntrackService.post<LoginResponse>(
        ServiceUrl.refreshToken,
        refreshToken
      ).pipe(
        map((response) => {
          if (response.jwtToken !== null) {
            this.dataService.setUserDetail(response);
            this.tokenStorage.saveToken(response.jwtToken);
            this.tokenStorage.setRefreshToken(response.refreshToken);
            this.tokenStorage.saveUser(response);
            return response.jwtToken;
          } else {
         
            return null;
          }
        }),
        catchError((error) => {
          console.log(error);
          if (error.status === 401) {
            // Redirect to the login page
            this.router.navigate(['/login']);
          }
          return of(null); 
        })
      );
    } else {
      return of(null); 
    }
  }
}

