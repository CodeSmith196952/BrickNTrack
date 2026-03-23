import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FeatherModule } from "angular-feather";
import {
  Home, Menu, User, Users, Grid, Layout, Folder, Disc,
  PlusCircle, DollarSign, TrendingUp, MessageSquare, Bell,
  Star, Calendar, Shield, BarChart2, Search, ChevronDown,
  ChevronRight, Settings, Lock, XCircle, Heart, Briefcase,
  UserPlus, Edit, Trash2, Eye, Check, X, AlertTriangle,
  Info, ArrowLeft, ArrowRight, Download, Upload, Filter,
  Clock, MapPin
} from "angular-feather/icons";

const icons = {
  Home, Menu, User, Users, Grid, Layout, Folder, Disc,
  PlusCircle, DollarSign, TrendingUp, MessageSquare, Bell,
  Star, Calendar, Shield, BarChart2, Search, ChevronDown,
  ChevronRight, Settings, Lock, XCircle, Heart, Briefcase,
  UserPlus, Edit, Trash2, Eye, Check, X, AlertTriangle,
  Info, ArrowLeft, ArrowRight, Download, Upload, Filter,
  Clock, MapPin
};
import { FormBuilder, FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FullComponent } from "./layouts/full/full.component";
import { DemoFlexyModule } from "./demo-flexy-module";
import { HttpClientModule } from "@angular/common/http";

import { CommonModule, DatePipe } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

// Core & Shared
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";

// PrimeNG
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

// Modules
import { DashboardModule } from "./dashboard/dashboard.module";
import { ComponentsModule } from "./components/components.module";

// Components
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
import { BuilderMasterComponent } from "./Master/builder-master/builder-master.component";
import { ProjectMasterComponent } from "./Master/project-master/project-master.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { ProjectmilestoneComponent } from './Master/project-master/Project-milestone/projectmilestone/projectmilestone.component';
import { ExpensesComponent } from './Master/project-master/Expenses/expenses/expenses.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { RegisterComponent } from './register/register.component';
import { BuilderProfileComponent } from './builder-profile/builder-profile.component';
import { SavedPropertiesComponent } from './saved-properties/saved-properties.component';
import { RecentlyViewedComponent } from './recently-viewed/recently-viewed.component';
import { PropertyCompareComponent } from './property-compare/property-compare.component';

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
    AboutUsComponent,
    RegisterComponent,
    BuilderProfileComponent,
    SavedPropertiesComponent,
    RecentlyViewedComponent,
    PropertyCompareComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FeatherModule.pick(icons),
    DemoFlexyModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,

    // Core & Shared
    CoreModule,
    SharedModule,

    // Feature Modules
    DashboardModule,
    ComponentsModule,

    // PrimeNG
    DialogModule,
    TableModule,
    CheckboxModule,
    ToastModule,
    DropdownModule,
    AutoCompleteModule,
    AccordionModule,
    TimelineModule,
    PasswordModule,
    MenubarModule,
    InputTextModule,
    InputNumberModule,
    SplitButtonModule,
    BadgeModule,
    TabViewModule,
    MultiSelectModule,
  ],
  providers: [
    FormBuilder,
    MessageService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
