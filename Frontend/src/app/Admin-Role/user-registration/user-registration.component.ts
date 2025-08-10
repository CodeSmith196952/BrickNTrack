
import { Component, OnInit, ViewChild } from "@angular/core";
import { brickntrackService } from "src/app/service/brickntrack-service.service";
import { ServiceUrl } from "../../service/service-url.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Table } from "primeng/table";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MessageService } from "primeng/api";
import {
  UserRegistration,
  ChangePassword,
} from "../../service/user-model.service";
import { faSmileWink } from "@fortawesome/free-solid-svg-icons";
import { LazyLoadEvent } from "primeng/api";
import Swal from "sweetalert2";
import { UserScreenAccesData } from "src/app/service/user-model.service";
import { DataService } from "src/app/service/data.service";
import { Pagination } from "src/app/Models/Pagination"; 


@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {
 public userRegistration: UserRegistration = new UserRegistration();
  public user: UserRegistration = new UserRegistration();
  public model: ChangePassword = new ChangePassword();
  showMsg: boolean = false;
  form!: FormGroup;
  changePasswordForm!: FormGroup;
  editUserForm!: FormGroup;
  errMsg = [];
  title: any;
  locId: any;
  submitted = false;
  editUserFormSubmitted = false;
  changePasswordFormSubmitted = false;
  userManager: any;
  displayChangePassword = false;
  display: boolean = false;
  roles!: any;
  filter = "";
  key: string = "name";
  reverse: boolean = false;
  location: any;
  display1 = false;
  activebuttonShow: boolean = false;
  display2 = false;
  $index = 0;
  userNameForPasswordChange!: string;
  roleName: string | null = null;
  userType: string = "";
  allLocations: any;
  public userAccessData: UserScreenAccesData | any;
  DealerMappList: any;
  dealerId: any;
  allLocationCode: any;
  allDealers: any;
  selectedDealerId: any;
  departmentList: any;
  toShowDealer: boolean = false;
  showPassword: boolean = false;
  Filterform!: FormGroup;
 public pagination: Pagination = new Pagination(1, 0, 20, 0, [20, 50, 100]);
  public searchText: string = '';

  constructor(
    private brickntrackService: brickntrackService,
    private fb: FormBuilder,
    private message: MessageService,
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private fb2: FormBuilder,
  ) {
    // this.brickntrackService.isLoggedIn$ = true;
    const authUserJSON = sessionStorage.getItem("auth-user");
    if (authUserJSON) {
      const authUser = JSON.parse(authUserJSON);
      this.roleName = authUser.roleName;
    }
    // this.userAccessData = this.dataService.getUserScreenAccessMenu("USERMGMT");

    this.Filterform = this.fb2.group({
      Department: [''],
      Role: [''],
      Approver: [''],
    });
  }

  ngOnInit(): void {
    this.userType = "Internal";

    //this.getAllUser();
    this.getAllUsersOnPagination();
    this.ResetEditUser();
    this.ResetNewUser();
    this.ResetChangePassword();
    this.getAllActiveRoles();


    // this.userAccessData =
    //   this.dataService?.getUserScreenAccessMenu("user-registration");
    this.editUserForm.get("userName")?.disable();
    this.allLocations = [{ locationId: 0, locationName: "--Choose Options--" }];
  }

  ClearFilters() {
    this.Filterform.get('Department')?.setValue('')
    this.Filterform.get('Role')?.setValue('')
    this.Filterform.get('Approver')?.setValue('')
    //this.getAllUser();
    this.getAllUsersOnPagination();
  }


  getAllActiveRoles() {
    this.brickntrackService.get<any>(null, ServiceUrl.getAllActiveRoles).subscribe(
      (response) => {
        if (this.userType === "Internal") {
          this.roles = response.filter((x: any) => {
            return x.roleName !== "Dealer";
          });
        } else if (this.userType === "External") {
          this.roles = response.filter((x: any) => {
            return x.roleName === "Dealer";
          });
        }
      },

      (r) => {
        alert(r.error.error);
      }
    );
  }

  loadData(event: LazyLoadEvent) {}

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];

      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors["mustMatch"]) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onEditUserFormReset(): void {
    this.editUserFormSubmitted = false;

    this.editUserForm.reset();
  }

  onChangePasswordchangeReset(): void {
    this.changePasswordFormSubmitted = false;

    this.changePasswordForm.reset();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get f1(): { [key: string]: AbstractControl } {
    return this.editUserForm.controls;
  }

  get f2(): { [key: string]: AbstractControl } {
    return this.changePasswordForm.controls;
  }

  getUserRoleDisplayName(rolename: any) {
    let roleDisplayName = this.roles.find(
      (x: { roleName: any }) => x.roleName == rolename
    )?.displayName;

    return roleDisplayName;
  }

  ResetEditUser() {
    this.editUserForm = this.fb.group(
      {
        firstName: ["", [Validators.required, Validators.minLength(3)]],

        deptId: ['', [Validators.required]],
        isapprover: [''],

        userId: [0],

        changePassword: [false],
     

        lastName: ["", [Validators.required, Validators.minLength(3)]],

        mobileNumber: ["", [Validators.required]],

        email: [
          "",

          [
            Validators.required,

            Validators.email,

            Validators.minLength(5),

            Validators.maxLength(50),
            Validators.pattern(
              "^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$"
            ),
          ],
        ],

        roleId: [0, [Validators.required]],
        locationId: [0],

        userName: [
          "",
          [
            Validators.required,

            Validators.minLength(5),
            Validators.pattern("^[a-zA-Z][a-zA-Z0-9_]{4,}$"),
          ],
        ],

        password: [
          "",

          [
            Validators.required,

            Validators.minLength(5),

            Validators.maxLength(15),

            Validators.pattern(
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*[#$^+=!*()@%&]).{5,}$"
            ),
          ],
        ],
        IsActive: [""],

        confirmPassword: ["", [Validators.required]],
      },

      {
        validator: this.MustMatch("password", "confirmPassword"),
      }
    );
  }


  
  OnPageChange(event: any): void {
    this.pagination.page = event.first / event.rows + 1;
    this.pagination.pageSize = event.rows;
    this.getAllUsersOnPagination();
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

  ResetNewUser() {
    this.form = this.fb.group(
      {
        firstName: ["", [Validators.required, Validators.minLength(3)]],

        lastName: ["", [Validators.required, Validators.minLength(3)]],

        deptId: ["", [Validators.required]],
        isapprover: [""],

        mobileNumber: [
          "",

          [
            Validators.required,

            Validators.minLength(10),

            Validators.maxLength(10),

            Validators.pattern("[0-9]*"),
            this.noWhitespaceValidator,
          ],
        ],

        email: [
          "",

          [
            Validators.required,

            Validators.email,

            Validators.minLength(5),

            Validators.maxLength(50),
            Validators.pattern(
              "^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$"
            ),
          ],
        ],
        IsActive: [true],

        password: [
          "",

          [
            Validators.required,

            Validators.minLength(5),

            Validators.maxLength(15),

            Validators.pattern(
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*[#$^+=!*()@%&]).{5,}$"
            ),
          ],
        ],

        confirmPassword: ["", [Validators.required]],

        roleId: ["", [Validators.required]],
        locationId: [0, [Validators.required]],
       
        userName: [
          "",

          [
            Validators.required,

            Validators.minLength(5),

            Validators.pattern("^[a-zA-Z][a-zA-Z0-9_]{4,}$"),
          ],
        ],
      },

      { validator: this.MustMatch("password", "confirmPassword") }
    );
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);

    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // For Password Change

  ResetChangePassword() {
    this.changePasswordForm = this.fb.group(
      {
        userName: [""],

        password: [
          "",

          [
            Validators.required,

            Validators.minLength(5),

            Validators.maxLength(250),
            Validators.pattern(
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*[#$^+=!*()@%&]).{5,}$"
            ),
          ],
        ],

        confirmPassword: ["", [Validators.required]],
      },

      {
        validator: this.MustMatch("password", "confirmPassword"),
      }
    );
  }

  // getAllUser() {  
  //   this.brickntrackService.get<any>(null, ServiceUrl.getUsersData).subscribe(
  //     (response) => {
  //       // this.userManager = response;


  //       this.userManager = response.map((user: any) => {
  //         // Match the department by departmentId and add departmentName to the user
  //         const department = this.departmentList.find(
  //           (dept: any) => dept.deptId === user.deptId
  //         );
  //         return {
  //           ...user,
  //           departmentName:  department.departmentName  // Add departmentName property
  //         };
  //       });
  //     },

  //     (r) => {
  //       alert(r.error.error);
  //     }
  //   );
  // }

  // OnPageChange(event: any): void {
  //   this.pagination.page = event.first / event.rows + 1;
  //   this.pagination.pageSize = event.rows;
  //   this.getAllUsersOnPagination();
  // }

  getAllUsersOnPagination(): void {
    const query = {
      // page: this.pagination.page,
      // pageSize: this.pagination.pageSize,
      searchText: this.searchText || '',
      department: this.Filterform.value.Department || '',
      role: this.Filterform.value.Role || '',
      approver: this.Filterform.value.Approver || ''
    };
    
  
    this.brickntrackService.get<any>(null, ServiceUrl.getAllUsersOnPagination, query)
      .subscribe(
        response => {
          this.userManager = response.items.map((user: any) => {
            const department = this.departmentList.find((dept: any) => dept.deptId === user.deptId);
            return {
              ...user,
              departmentName: department?.departmentName || ''
            };
          });
  
          // this.pagination.totalTransactionCount = response.totalTransactionCount;
          // this.pagination.filterRecordCount = response.filterRecordCount;
          // this.pagination.pageSize = response.pageSize;
        },
        error => {
          console.error('Error fetching user data:', error);
        }
      );
  }
  

  ShowMessage(messageType: string, title: string, message: string) {
    this.message.add({
      severity: messageType,

      summary: title,

      detail: message,
    }); 
  }

  


  onReset(): void {
    this.submitted = false;
    this.form.reset();
    this.form.get("locationId")?.setValue(0);
  }

  editUser(user: any) {
    
    this.display1 = true;
    this.submitted = false;
    this.title = "Edit User Registration";
    this.activebuttonShow = true;

    this.editUserForm.controls["firstName"].setValue(user.firstName);
    this.editUserForm.controls["IsActive"].setValue(user.isActive);
    this.editUserForm.controls["lastName"].setValue(user.lastName);
    this.editUserForm.controls["deptId"].setValue(user.deptId);
    this.editUserForm.controls["userId"].setValue(user.userId);
    this.editUserForm.controls["mobileNumber"].setValue(user.mobileNumber);
    this.editUserForm.controls["email"].setValue(user.email);
    this.editUserForm.controls["userName"].setValue(user.userName);
    this.editUserForm.controls["isapprover"].setValue(user.isapprover);
    // this.editUserForm.controls["locationId"].setValue(user.location.locationId);
    this.editUserForm.controls["roleId"].setValue(user.roleId);
    this.editUserForm.controls["changePassword"].setValue(false);
    this.editUserForm.controls["password"].setValue("Dummy@1234");
    this.editUserForm.controls["confirmPassword"].setValue("Dummy@1234");

    this.displayChangePassword = false;
  }

  open() {
    this.form.reset();

    this.submitted = false;
    this.activebuttonShow = false;
    this.display = true;
    this.form.get("locationId")?.setValue(0);
  }

  openChangePassword(user: any) {
    this.changePasswordForm.reset();

    this.submitted = false;

    this.userNameForPasswordChange = user.userName;

    this.display2 = true;
  }

  keyPressNumbers(event: any) {
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();

      return false;
    } else {
      return true;
    }
  }

  keyDownFunction(event: { keyCode: number }, flag: boolean) {
    if (event.keyCode === 13) {
      if (this.display == true && flag == true) {
      } else if (this.display1 == true && flag == false) {
        // this.updateUser();
      } else if (this.display2 == true && flag == false) {
        // this.changeUserPassword();
      }
    }
  }

  // changeUserPassword() {
  //   this.submitted = true;

  //   if (this.changePasswordForm.invalid) {
  //     return;
  //   }

  //   let changePassword = new ChangePassword();

  //   changePassword.userName = this.userNameForPasswordChange;

  //   changePassword.password = this.model.password;

  //   changePassword.oldPassword = "Pass@123";

  //   changePassword.confirmPassword = this.model.confirmPassword;

  //   this.brickntrackService.postPatch<string>(
  //     ServiceUrl.resetPasswordByAdmin,

  //     changePassword
  //   ).subscribe(
  //     (data) => {
  //       this.ShowMessage("success", "Success", "Password changed succesfully");
  //     },

  //     (error) => {
  //       this.errMsg = error;

  //       if (error.errors != null && error.errors != undefined)
  //         this.errMsg = error.errors[0];

  //       this.ShowMessage("error", "Error", "this.errMsg");
  //     }
  //   );

  //   this.submitted = false;

  //   this.display2 = false;

  //   this.model = new ChangePassword();

  //   this.changePasswordForm.reset();
  // }
  onTabChange(event: any) {
    if (event.index === 0) {
      this.userType = "Internal";
      this.getAllActiveRoles();
      //this.getAllUser();
      this.getAllUsersOnPagination();
      // this.getAllLocations();
    } else if (event.index === 1) {
      this.userType = "External";
      this.getAllActiveRoles();
      //this.getAllUser();
      this.getAllUsersOnPagination();
      // this.getAllLocations();
    }
  }

  keyPressNum(event: any) {
    const pattern = /[0-9]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPressChar(event: any) {
    const pattern = /[A-Za-z]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  keyPressUserName(event: any) {
    const pattern = /[A-Za-z0-9_]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
