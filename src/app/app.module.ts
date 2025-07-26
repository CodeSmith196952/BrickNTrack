import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullComponent } from './layouts/full/full.component';
import { DemoFlexyModule } from './demo-flexy-module'


// Modules
import { DashboardModule } from './dashboard/dashboard.module';
import { ComponentsModule } from './components/components.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { CostMonitoringDashboardComponent } from './cost-monitoring-dashboard/cost-monitoring-dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProgressTrackerComponent } from './progress-tracker/progress-tracker.component';

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    LandingPageComponent,
    PageNotFoundComponent,
    AddPropertyComponent,
    CostMonitoringDashboardComponent,
    LoginComponent,
    ProgressTrackerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FeatherModule.pick(allIcons),
    DemoFlexyModule,
    DashboardModule,
    ComponentsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
