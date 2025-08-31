import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AlertsComponent } from "./components/alerts/alerts.component";
import { ButtonsComponent } from "./components/buttons/buttons.component";
import { ChipsComponent } from "./components/chips/chips.component";
import { ExpansionComponent } from "./components/expansion/expansion.component";
import { FormsComponent } from "./components/forms/forms.component";
import { GridListComponent } from "./components/grid-list/grid-list.component";
import { MenuComponent } from "./components/menu/menu.component";
import { ProgressSnipperComponent } from "./components/progress-snipper/progress-snipper.component";
import { ProgressComponent } from "./components/progress/progress.component";
import { SlideToggleComponent } from "./components/slide-toggle/slide-toggle.component";
import { SliderComponent } from "./components/slider/slider.component";
import { SnackbarComponent } from "./components/snackbar/snackbar.component";
import { TabsComponent } from "./components/tabs/tabs.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { TooltipsComponent } from "./components/tooltips/tooltips.component";
import { ProductComponent } from "./dashboard/dashboard-components/product/product.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FullComponent } from "./layouts/full/full.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { AddPropertyComponent } from "./add-property/add-property.component";
import { CostMonitoringDashboardComponent } from "./cost-monitoring-dashboard/cost-monitoring-dashboard.component";
import { LoginComponent } from "./login/login.component";
import { ProgressTrackerComponent } from "./progress-tracker/progress-tracker.component";
import { ExplorePropertiesComponent } from "./explore-properties/explore-properties.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { PropertyInformationComponent } from "./property-information/property-information.component";
import { UserRegistrationComponent } from "./Admin-Role/user-registration/user-registration.component";
import { AuthGuard } from "./service/auth-guard.service";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { BuilderMasterComponent } from "./Master/builder-master/builder-master.component";
import { ProjectMasterComponent } from "./Master/project-master/project-master.component";
import { ProjectmilestoneComponent } from "./Master/project-master/Project-milestone/projectmilestone/projectmilestone.component";
import { ExpensesComponent } from "./Master/project-master/Expenses/expenses/expenses.component";


const routes: Routes = [
  { path: "", redirectTo: "/landingPage", pathMatch: "full" },
  { path: "landingPage", component: LandingPageComponent },
  { path: "exploreProperties", component: ExplorePropertiesComponent },
  { path: "login", component: LoginComponent },
  { path: "contactUs", component: ContactUsComponent },
  { path: "propertyInformation", component: PropertyInformationComponent },

  {
    path: "",
    component: FullComponent,
    children: [
      { path: "documents", component: DashboardComponent , canActivate: [AuthGuard]},
      { path: "property", component: AddPropertyComponent , canActivate: [AuthGuard]},
      { path: "costMonitoringDashboard", component: CostMonitoringDashboardComponent , canActivate: [AuthGuard]},
      { path: "progressTracker", component: ProgressTrackerComponent , canActivate: [AuthGuard]},
      { path: "userRegister", component: UserRegistrationComponent , canActivate: [AuthGuard]},
      { path: "editProfile", component: EditProfileComponent , canActivate: [AuthGuard]},
      { path: "buildermaster", component: BuilderMasterComponent , canActivate: [AuthGuard]},
      { path: "projectmaster", component: ProjectMasterComponent , canActivate: [AuthGuard]},
      { path: "projectmilestone", component: ProjectmilestoneComponent , canActivate: [AuthGuard]},
      { path: "expenses", component: ExpensesComponent , canActivate: [AuthGuard]},
     
    ],
  },

  { path: "", redirectTo: "/landingPage", pathMatch: "full" },
   { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
