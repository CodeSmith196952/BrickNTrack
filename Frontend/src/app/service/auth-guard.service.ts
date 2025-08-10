import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable, catchError, of, map } from "rxjs";
import { AuthguardServiceService } from "./authguard-service.service";
import { RouterModule, Routes } from "@angular/router";
import { brickntrackService } from "./brickntrack-service.service";
import { TokenStroageService } from "./token-stroage.service";
import { TokenModel, LoginResponse } from "./user-model.service";
import { DataService } from "./data.service";
import { ServiceUrl } from "./service-url.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  public refreshToken: TokenModel = new TokenModel();
  constructor(
    private Authguardservice: AuthguardServiceService,
    private router: Router,
    private token: TokenStroageService,
    private dataService: DataService,
    private brickntrackService: brickntrackService
  ) {}
  canActivate(): boolean {
    if (!this.Authguardservice.gettoken()) {
      this.router.navigate(["/login"]);
    }
    return this.Authguardservice.gettoken();
  }

  getRefreshToken(): Observable<string | null> {
   
    
    const refreshToken = this.token.getRefreshToken();

    if (refreshToken !== null) {  
      this.refreshToken.token = refreshToken;

      return this.brickntrackService.post<LoginResponse>(
        ServiceUrl.refreshToken,
        refreshToken
      ).pipe(
        map((response) => {
          if (response.jwtToken !== null) {
            this.dataService.setUserDetail(response);
            this.token.saveToken(response.jwtToken);
            this.token.setRefreshToken(response.refreshToken);
            this.token.saveUser(response);
            return response.jwtToken;
          } else {
            return null;
          }
        }),
        catchError((error) => {
          console.log(error);
          if (error.status === 401) {
            // Redirect to the login page
            this.router.navigate(["/login"]);
            localStorage.clear();
          }

          Swal.fire({
            icon: "error",
            title: "Session Expired !",
            text: "Please Re Login",
          });

          return of(null);
        })
      );
    } else {
      return of(null);
    }
  }
}
