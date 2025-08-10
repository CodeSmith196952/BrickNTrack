import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, from } from "rxjs";
import { MessageService } from "primeng/api";
import { ConfigParms } from "../common/portal-config";
import {environment} from "../../environments/environment";

export interface QueryParams {
  [key: string]: string | number;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class brickntrackService {
  public readonly END_POINT: string = "";
  endPoint: string = "";
  baseUrl: string = "";
  public isLoggedIn$: boolean = false;
  public enableOTPOnUI = false;

  constructor(private http: HttpClient, private message: MessageService) {
    if (ConfigParms.IsProd) {
      this.END_POINT = environment.apiUrl;     
    } else {
      this.END_POINT = ConfigParms.APIUrl;
      console.log("API running locally - URL" + this.END_POINT);     
    }
  }

  get<returnType>(
    id: number | null,
    route: string,

    qp: QueryParams = {},
    method: "get" | "delete" = "get"
  ): Observable<returnType> {
    const cfqu = this.correctFormatForQueryUrl(qp);
    return this.http[method](
      `${this.END_POINT}/${route}${id ? "/" + id : ""}${cfqu}`
    ) as Observable<returnType>;
  }

  delete<returnType>(
    id: number | null,
    route: string,
    method: "delete"
  ): Observable<returnType> {
    return this.http[method](
      `${this.END_POINT}/${route}${id ? "/" + id : ""}`
    ) as Observable<returnType>;
  }

  post<returnType>(route: string, data: any): Observable<returnType> {
   
    return this.http["post"](
      `${this.END_POINT}/${route}`,
      data
    ) as Observable<returnType>;
  }

  private correctFormatForQueryUrl(qp: QueryParams): string {
    if (this.baseUrl) {
    }
    const qpAsStr = this.mapQueryParamsToUrl(qp);
    return qpAsStr.length === 0 ? "" : `?${qpAsStr.join("&")}`;
  }

  private mapQueryParamsToUrl(qp: QueryParams): Array<string> {
    return Object.keys(qp).map((key: string) => {
      return `${key}=${qp[key]}`;
    });
  }

  ShowMessage(messageType: string, title: string, message: string) {
    this.message.add({
      severity: messageType,
      summary: title,
      detail: message,
    });
  }

  commonValidation(value: any): boolean {
    let ErrorList = [undefined, "", null];
    return ErrorList.includes(value) ? true : false;
  }

  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
   
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  keyacceptnumberAndDot(event:any) {
    var charCode = (event.which) ? event.which : event.keyCode;
   
    if (charCode == 46) {
      return true;
    }
    else if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}
