import { LoginResponse } from './../service/user-model.service';
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { brickntrackService } from '../service/brickntrack-service.service'; 
import { UserLogin } from './../service/user-model.service'; 
import { ServiceUrl } from "../service/service-url.service";
import { DataService } from "../service/data.service"; 
import { TokenStroageService } from "../service/token-stroage.service"; 
import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { MessageService } from "primeng/api";
import { BehaviorSubject, Observable } from "rxjs";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  faUser = faUser;
  faKey = faKey;
  form!: FormGroup;
  form2!: FormGroup;
  form3!: FormGroup;
  public userLogin: UserLogin = new UserLogin();
  public loginInvalid = false;
  private formSubmitAttempt = false;
  private returnUrl!: string;
  isLoggedIn = true;
  isLoginFailed = false;
  OrdersTrack: any;
  parmsId: any = 0;
  errorMessage = "";
  display1: boolean = false;
  roles: string[] = [];
  submitted = false;
  rememberMe = false;
  isPasswordVisible = false;
  private currentUserSubject!: BehaviorSubject<UserLogin>;
  public currentUser!: Observable<UserLogin>;

  captchaImage: string = ""; // Store the generated image URL
  captchaVerified: boolean = false;
  generatedCaptcha: string = "";
  captchaIncorrect: boolean = false;

  title: any;
  // otpSent:any
  Display: boolean = false;

  otp!: string;
  otpSent: boolean = false;
  statusTracker: boolean = false;
  status: any;
  applicationNo: string = "";

  resendDisabled = false;
  resendTimer = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private brickntrackService: brickntrackService,
    private dataService: DataService,
    private tokenStorage: TokenStroageService,
    private formBuilder: FormBuilder,
    private message: MessageService
  ) {
    this.brickntrackService.isLoggedIn$ = false;
  

    this.form = this.fb.group({
   
      username: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.minLength(5),
          Validators.maxLength(50),
          this.noWhitespaceValidator,

          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ],
      ],
   
      password: [
        "",
        [
          Validators.required,
     
          this.noWhitespaceValidator,

        ],
      ],
    });
  }
  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || "").trim().length === 0;
    if (!isWhitespace) {
      if (control.value != null || control.value.length > 0) {
        if (control.value.startsWith(" ")) {
          isWhitespace = true;
        } else if (control.value.endsWith(" ")) {
          isWhitespace = true;
        }
      }
    }
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }



  ngOnInit(): void {
   

  
  
  
  }
  open() {
    this.display1 = true;
  }

  OnLoad() {
    this.userLogin.userName = "";
    this.userLogin.password = "";
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  login() {
    debugger
    this.spinner.show()
    // if (this.form.invalid) {
    //   return;
    // }
      // Captcha validation

    this.submitted = true;
    var body = this.form.value;
    this.brickntrackService
      .post<any>(ServiceUrl.login, body)
      .subscribe(
        (response) => {
          this.spinner.hide()
          if (response.token !== null) {
            this.tokenStorage.setUserName(response.userName);
            this.dataService.setUserDetail(response);
            this.dataService.setUserMenu(response.menuAccess);
            this.tokenStorage.saveToken(response.jwtToken);
            this.tokenStorage.setRefreshToken(response.refreshToken);
            this.tokenStorage.setrevoketoken(response.revoketoken);
            this.tokenStorage.saveUser(response);
            this.isLoginFailed = false;
            this.isLoggedIn = true;
         this.router.navigate(["/costMonitoringDashboard"]);
          }
          if (this.rememberMe) {
            this.userLogin.userName = this.form.get("username")?.value;
            this.userLogin.password = this.form.get("password")?.value;
            localStorage.setItem("currentUser", JSON.stringify(this.userLogin));
            localStorage.setItem(
              "rememberCurrentUser",
              this.rememberMe ? "true" : "false"
            );
          } else {
            localStorage.clear();
            this.spinner.hide()
          }
          this.submitted = false;
          this.spinner.hide()
        },
        (r) => {
          this.spinner.hide()
          let msg = "";
          if (r.error.message == undefined) {
            msg = "Please check connection with API. Http Error: " + r.message;
          } else {
            msg = r.error.message;
          }
          Swal.fire({ icon: "error", title: "", text: msg });
          this.submitted = false;
        }
      );
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
  }


  






}
