import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

interface sidebarMenu {
  link: string;
  icon: string;
  menu: string;
  children?: sidebarMenu[];
   expanded?: boolean;
}

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent {

  search: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,    private router: Router,) { }

  routerActive: string = "activelink";

  sidebarMenu: sidebarMenu[] = [
    
    {
      link: "/costMonitoringDashboard",
      icon: "layout",
      menu: "Dashboard",
    },
    {
      icon: "user",
      menu: "Admin Role",
          expanded: false,
      children: [
        {
          link: "/userRegister",
          icon: "user",
          menu: "User Register"
        },
     
      ],
      link: ''
    },
    {
      link: "/documents",
      icon: "folder",
      menu: "Document",
    },
        {
      icon: "",
      menu: "Master",
          expanded: false,
      children: [
        {
          link: "/buildermaster",
          icon: "user",
          menu: "Builder Master"
        },
        {
          link: "/projectmaster",
          icon: "user",
          menu: "Project Master"
        },
     
      ],
      link: ''
    },
    {
      link: "/property",
      icon: "disc",
      menu: "Property Listing",
    },
    {
      link: "/progressTracker",
      icon: "info",
      menu: "Progress Tracker",
    },


    // {
    //   link: "/grid-list",
    //   icon: "file-text",
    //   menu: "Grid List",
    // },
    // {
    //   link: "/menu",
    //   icon: "menu",
    //   menu: "Menus",
    // },
    // {
    //   link: "/table",
    //   icon: "grid",
    //   menu: "Tables",
    // },
    // {
    //   link: "/expansion",
    //   icon: "divide-circle",
    //   menu: "Expansion Panel",
    // },
    // {
    //   link: "/chips",
    //   icon: "award",
    //   menu: "Chips",
    // },
    // {
    //   link: "/tabs",
    //   icon: "list",
    //   menu: "Tabs",
    // },
    // {
    //   link: "/progress",
    //   icon: "bar-chart-2",
    //   menu: "Progress Bar",
    // },
    // {
    //   link: "/toolbar",
    //   icon: "voicemail",
    //   menu: "Toolbar",
    // },
    // {
    //   link: "/progress-snipper",
    //   icon: "loader",
    //   menu: "Progress Snipper",
    // },
    // {
    //   link: "/tooltip",
    //   icon: "bell",
    //   menu: "Tooltip",
    // },
    // {
    //   link: "/snackbar",
    //   icon: "slack",
    //   menu: "Snackbar",
    // },
    // {
    //   link: "/slider",
    //   icon: "sliders",
    //   menu: "Slider",
    // },
    // {
    //   link: "/slide-toggle",
    //   icon: "layers",
    //   menu: "Slide Toggle",
    // },
  ]

  Logout() {
    window.sessionStorage.clear();
   
    this.router.navigate(['./login']);
    // window.location.reload();
  }

}
