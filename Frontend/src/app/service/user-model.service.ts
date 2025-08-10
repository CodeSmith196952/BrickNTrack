export class UserLogin {
  userName!: string;
  password!: string;
}
 
export class UserRegistration {
    id!: number;
    userName!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    password!: string;
    confirmPassword!: string;
    acceptTerms: boolean = true;
    role!: string;
    roleId!: number;
    name!: string;
    isActive!:boolean;
    Isapprover!:boolean;
    Created!: string;
    mobileNumber!: string;
    locationId!:number;
    
    deptId!:number;
}
 
export class ChangePassword {
  userName!: string;
  password!: string;
  oldPassword!: string;
  confirmPassword!: string;
}
 
export class LoginResponse {
  firstName!: string;
  lastName!: string;
  Email!: string;
  role!: string;
  jwtToken!: string;
  refreshToken!: string;
  revoketoken!: string;
  mobNo!: string;
  userName!: string;
  menuAccess!: Array<NavItem>;
}
 
export class ForgotPasswordRequest {
  userName!: string;
  email!: string;
}
 
export class ForgotPassword {
  userName!: string;
  otp!: string;
  newPassword!: string;
  confirmPassword!: string;
}
export class ResetPasswordRequest {
  token!: string;
  password!: string;
  confirmPassword!: string;
}
 
export class TokenModel {
  token!: string;
}
 
export interface NavItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  route?: string;
  routingURL?: string;
  children?: NavItem[];
  menuIcon?: string;
}
 
export class UserRoleAccessMapping {
  roleName!: string;
  roleId!: number;
  isActive!: boolean;
  userAccessManagerResponse!: Array<UserAccessManagerResponse>;
}
 
export class UserAccessManagerResponse {
  userAccessManagerId!: number;
  roleId!: number;
  roleName!: string;
  userScreenId!: number;
  screenName!: string;
  screenCode!: string;
  canCreate!: boolean;
  canUpdate!: boolean;
  canDeactivate!: boolean;
  isActive!: boolean;
}
 
export class AllUserRoleAccess {
  roleId: number = 0;
  roleName: string = '';
  userAccess: string = '';
  status!: boolean;
}
 
export class UserScreenAccesData {
  screenCode!: string;
  canRead!: boolean;
  canCreate!: boolean;
  canUpdate!: boolean;
  canDeactivate!: boolean;
}