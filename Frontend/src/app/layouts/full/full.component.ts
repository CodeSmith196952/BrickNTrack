import { Component, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { faDashboard } from '@fortawesome/free-solid-svg-icons';
import { DataService } from "../../service/data.service";
import { NavItem } from "src/app/service/user-model.service";
import { NgbNavbar } from "@ng-bootstrap/ng-bootstrap";

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

  constructor(private breakpointObserver: BreakpointObserver,    private router: Router, private dataApi: DataService,) { }
  public userDisplayName = "";
  routerActive: string = "activelink";
   currentDate: Date = new Date();
  @Input() ToggleSlide = false;
  visibleSidebar1: boolean = true;
  screenWidth = 0;
  public navbarData: any[] = [];
  fadashboard = faDashboard;
  public userRole = "";
  
 
  navItems!: Array<NavItem>;
  NgbNavbar = NgbNavbar;

  items: any;
  signOut: any;

  Usser: any;


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
        // {
        //   link: "/projectmilestone",
        //   icon: "user",
        //   menu: "Project Milestone"
        // },
        // {
        //   link: "/expenses",
        //   icon: "user",
        //   menu: "Expenses"
        // },
     
      ],
      link: ''
    },
    {
      link: "/property",
      icon: "disc",
      menu: "Property Listing",
    },
    // {
    //   link: "/progressTracker",
    //   icon: "info",
    //   menu: "Progress Tracker",
    // },


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
  ngOnInit(): void {


    this.userRole = this.dataApi?.getUserRole();
    this.userDisplayName = this.dataApi?.getUserDisplayName();


    this.screenWidth = window.innerWidth;

    this.items = this.navItems.map((x) => ({
      label: x.displayName,
      icon: x.menuIcon,
      items:
        x.children && x.children.length > 0
          ? x.children.map((child) => ({
              label: child.displayName,
              icon: child.menuIcon,
              routerLink: child.routingURL,
            }))
          : [],
      routerLink: x.routingURL,
    }));
    // this.items.push({
    //   label: "Vehicle Transaction",
    //   icon: "pi pi-fw pi-car",
    //   routerLink: "/vehicleMoment",
    // });
    //    this.items.upshift({
    //     label: "Dashboard",
    //     icon: "pi pi-fw pi-home",
    //     routerLink: "/dashboard",
    // },)

    // this.items = [
    //   {
    //     label: "Dashboard",
    //     icon: "pi pi-fw pi-home",
    //     routerLink: "/dashboard",
    //   },
    //   {
    //     label: "Admin",
    //     icon: "pi pi-fw pi-user",
    //     items: [
    //       {
    //         label: "Role Management",
    //         icon: "pi pi-fw pi-file",
    //         routerLink: "/role",
    //       },
    //       {
    //         label: "User Registration",
    //         icon: "pi pi-fw pi-user",
    //         routerLink: "/user-registration",
    //       },
    //       {
    //         label: "User Role Mapping",
    //         icon: "pi pi-fw pi-user",
    //         routerLink: "/userRoleMapping",
    //       },
    //     ],
    //   },
    //   {
    //     label: "Master",
    //     icon: "pi pi-fw pi-user",
    //     items: [
    //       {
    //         label: "Dealer Master",
    //         icon: "pi pi-fw pi-file",
    //         routerLink: "/dealerMaster",
    //       },
    //       {
    //         label: "Location Master",
    //         icon: "pi pi-fw pi-map",
    //         routerLink: "/locationMaster",
    //       },
    //       {
    //         label: "Device Mapping",
    //         icon: "pi pi-fw pi-mobile",
    //         routerLink: "/DeviceMapping",
    //       },
    //     ],
    //   },
    //   {
    //     label: "Vehicle Transaction",
    //     icon: "pi pi-fw pi-car",
    //     routerLink: "/vehicleMoment",
    //   },
    // ];

    this.signOut = [
      {
        label: "User Options",
        icon: "pi pi-fw pi-user",
        items: [
          {
            label: "Profile",
            icon: "pi pi-fw pi-user-edit",
            routerLink: "/Profile",
          },
          {
            label: "Logout",
            icon: "pi pi-fw pi-lock",
            command: () => this.logout(),
          },
        ],
      },
    ];
  }

  logout() {
    Swal.fire({
      title: "Logout",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(["/login"]);
      }
    });
  }

}
