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

const routes: Routes = [
  { path: "", redirectTo: "/landingPage", pathMatch: "full" },
  { path: "landingPage", component: LandingPageComponent },
  { path: "exploreProperties", component: ExplorePropertiesComponent },
  { path: "login", component: LoginComponent },
  {
    path: "",
    component: FullComponent,
    children: [
      { path: "documents", component: DashboardComponent },
      { path: "property", component: AddPropertyComponent },
      { path: "costMonitoringDashboard", component: CostMonitoringDashboardComponent },
      { path: "progressTracker", component: ProgressTrackerComponent },
      { path: "grid-list", component: GridListComponent },
      { path: "menu", component: MenuComponent },
      { path: "tabs", component: TabsComponent },
      { path: "expansion", component: ExpansionComponent },
      { path: "chips", component: ChipsComponent },
      { path: "progress", component: ProgressComponent },
      { path: "toolbar", component: ToolbarComponent },
      { path: "progress-snipper", component: ProgressSnipperComponent },
      { path: "snackbar", component: SnackbarComponent },
      { path: "slider", component: SliderComponent },
      { path: "slide-toggle", component: SlideToggleComponent },
      { path: "tooltip", component: TooltipsComponent },
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
