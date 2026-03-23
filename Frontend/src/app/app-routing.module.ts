import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ExplorePropertiesComponent } from './explore-properties/explore-properties.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { PropertyInformationComponent } from './property-information/property-information.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { CostMonitoringDashboardComponent } from './cost-monitoring-dashboard/cost-monitoring-dashboard.component';
import { ProgressTrackerComponent } from './progress-tracker/progress-tracker.component';
import { UserRegistrationComponent } from './Admin-Role/user-registration/user-registration.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { BuilderMasterComponent } from './Master/builder-master/builder-master.component';
import { ProjectMasterComponent } from './Master/project-master/project-master.component';
import { ProjectmilestoneComponent } from './Master/project-master/Project-milestone/projectmilestone/projectmilestone.component';
import { ExpensesComponent } from './Master/project-master/Expenses/expenses/expenses.component';
import { RegisterComponent } from './register/register.component';
import { BuilderProfileComponent } from './builder-profile/builder-profile.component';
import { SavedPropertiesComponent } from './saved-properties/saved-properties.component';
import { RecentlyViewedComponent } from './recently-viewed/recently-viewed.component';
import { PropertyCompareComponent } from './property-compare/property-compare.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/landingPage', pathMatch: 'full' },
  { path: 'landingPage', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'exploreProperties', component: ExplorePropertiesComponent },
  { path: 'contactUs', component: ContactUsComponent },
  { path: 'aboutUs', component: AboutUsComponent },
  { path: 'propertyInformation/:id', component: PropertyInformationComponent },
  { path: 'builder-profile/:id', component: BuilderProfileComponent },

  // Authenticated routes (with sidebar)
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      // Existing routes
      { path: 'dashboard', component: DashboardComponent },
      { path: 'documents', component: DashboardComponent },
      { path: 'property', component: AddPropertyComponent },
      { path: 'costMonitoringDashboard', component: CostMonitoringDashboardComponent },
      { path: 'cost-monitoring', component: CostMonitoringDashboardComponent },
      { path: 'progressTracker', component: ProgressTrackerComponent },
      { path: 'progress-tracker', component: ProgressTrackerComponent },
      { path: 'editProfile', component: EditProfileComponent },
      { path: 'buildermaster', component: BuilderMasterComponent },
      { path: 'projectmaster', component: ProjectMasterComponent },
      { path: 'projectmilestone/:id', component: ProjectmilestoneComponent },
      { path: 'expenses/:id', component: ExpensesComponent },

      // Alias routes for new menu structure
      { path: 'builder/list', component: BuilderMasterComponent },
      { path: 'project/list', component: ProjectMasterComponent },
      { path: 'property/add', component: AddPropertyComponent },
      { path: 'property/explore', component: ExplorePropertiesComponent },
      { path: 'property/info/:id', component: PropertyInformationComponent },
      { path: 'property/detail/:id', component: PropertyInformationComponent },
      { path: 'builder/profile/:id', component: BuilderProfileComponent },
      { path: 'saved-properties', component: SavedPropertiesComponent },
      { path: 'recently-viewed', component: RecentlyViewedComponent },
      { path: 'property/compare', component: PropertyCompareComponent },

      // Admin routes
      { path: 'admin/users', component: UserRegistrationComponent, canActivate: [RoleGuard], data: { roles: ['Admin'] } },
      { path: 'userRegister', component: UserRegistrationComponent },

      // Lazy-loaded feature modules
      { path: 'messaging', loadChildren: () => import('./features/messaging/messaging.module').then(m => m.MessagingModule) },
      { path: 'notifications', loadChildren: () => import('./features/notifications/notifications.module').then(m => m.NotificationsModule) },
      { path: 'booking', loadChildren: () => import('./features/booking/booking.module').then(m => m.BookingModule) },
      { path: 'reviews', loadChildren: () => import('./features/reviews/reviews.module').then(m => m.ReviewsModule) },
    ]
  },

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
