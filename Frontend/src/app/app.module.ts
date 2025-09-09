import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";
import { FormBuilder, FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FullComponent } from "./layouts/full/full.component";
import { DemoFlexyModule } from "./demo-flexy-module";
import { HttpClientModule } from "@angular/common/http";

import { CommonModule, DatePipe } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

//prime ng
import { MessageService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { CheckboxModule } from "primeng/checkbox";
import { ToastModule } from "primeng/toast";
import { AccordionModule } from "primeng/accordion";
import { PasswordModule } from "primeng/password";
import { TimelineModule } from "primeng/timeline";
import { DropdownModule } from "primeng/dropdown";
import { AutoCompleteModule } from "primeng/autocomplete";
import { InputTextModule } from "primeng/inputtext";
import { SplitButtonModule } from "primeng/splitbutton";
import { MenubarModule } from "primeng/menubar";
import { BadgeModule } from "primeng/badge";
import { TabViewModule } from "primeng/tabview";
import { MultiSelectModule } from "primeng/multiselect";
import { InputNumberModule } from "primeng/inputnumber";

//newmodule


// Modules
import { DashboardModule } from "./dashboard/dashboard.module";
import { ComponentsModule } from "./components/components.module";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { AddPropertyComponent } from "./add-property/add-property.component";
import { CostMonitoringDashboardComponent } from "./cost-monitoring-dashboard/cost-monitoring-dashboard.component";
import { LoginComponent } from "./login/login.component";
import { ProgressTrackerComponent } from "./progress-tracker/progress-tracker.component";
import { ExplorePropertiesComponent } from "./explore-properties/explore-properties.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { PropertyInformationComponent } from "./property-information/property-information.component";
import { authInterceptorProviders } from "./service/auth-interceptor.service";
import { AuthguardServiceService } from "./service/authguard-service.service";
import { UserRegistrationComponent } from "./Admin-Role/user-registration/user-registration.component";
import { BuilderMasterComponent } from "./Master/builder-master/builder-master.component";
import { ProjectMasterComponent } from "./Master/project-master/project-master.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { ProjectmilestoneComponent } from './Master/project-master/Project-milestone/projectmilestone/projectmilestone.component';
import { ExpensesComponent } from './Master/project-master/Expenses/expenses/expenses.component';

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    LandingPageComponent,
    PageNotFoundComponent,
    AddPropertyComponent,
    CostMonitoringDashboardComponent,
    LoginComponent,
    ProgressTrackerComponent,
    ExplorePropertiesComponent,
    ContactUsComponent,
    ProjectMasterComponent,
    PropertyInformationComponent,
    UserRegistrationComponent,
    BuilderMasterComponent,
    EditProfileComponent,
    ProjectmilestoneComponent,
    ExpensesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FeatherModule.pick(allIcons),
    DemoFlexyModule,
    DashboardModule,
    FormsModule,

    DialogModule,
    TableModule,
    CheckboxModule,
    ReactiveFormsModule,
    HttpClientModule,

    ComponentsModule,
    MultiSelectModule,

    ToastModule,
    DropdownModule,
    AutoCompleteModule,
    CommonModule,
    AccordionModule,
    TimelineModule,
    PasswordModule,
    MenubarModule,
    InputTextModule,

    InputNumberModule,
    SplitButtonModule,
    BadgeModule,

    TabViewModule,
  ],
  providers: [
    authInterceptorProviders,

    AuthguardServiceService,
    FormBuilder,
    MessageService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
