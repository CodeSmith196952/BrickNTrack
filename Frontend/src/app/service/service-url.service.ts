export const ServiceUrl = {
  // User registration
 
  authenticate: "UserManagement/authenticate",
  forgotPassword: "UserManagement/forgot-password",
  resetPassword: "UserManagement/reset-password",
  changePassword: "UserManagement/change-password",
  resetPasswordByAdmin: "UserManagement/reset-password-by-admin",
 
  // USER registration
  registerUserManager: "UserManagement/RegisterUser",
  getUsersData: "UserManagement/GetAllUsers",
  getAllUsersOnPagination: "UserManagement/GetAllUsersPagination",
  updateUserDeatils: "UserManagement/UpdateUser",
  ressetPassword: "UserManagement/reset-password",
  refreshToken: "UserManagement/refreshtoken",
  revoketoken: "UserManagement/revoke-token",
 
  // role registration
  registerRole: "RoleManager/registerrole",
  getAllRoles: "RoleManager/getallroles",
  getRole: "RoleManager/getrole",
  getAllActiveRoles: "RoleManager/getallactiveroles",
 
  // User Role Access manager
  getSingleUserRoleAccessMapping: "UserAccessManager/getUserAccessbyRole",
  getAllUserRoleAccessMapping: "UserAccessManager/getAllUserRoleAccess",
  assignUserRoleAccessMapping: "UserAccessManager/assignUserAccessRole",
 




  // Login
  login:"UserManager/login",
  AddUser:"UserManager/AddUser",
  getAllUserDetail:"UserManager/getAllUserDetail",

  //master
  getAllBuilder: "Builder/getAllBuilder",
  addUpdateBuilder: "Builder/addUpdateBuilder",
  getAllActiveProject:"Project/getAllActiveProject",
  addUpdateProject:"Project/addUpdateProject",



};  