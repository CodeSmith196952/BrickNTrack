import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { brickntrackService } from 'src/app/service/brickntrack-service.service'; 
import Swal from 'sweetalert2';
import { ServiceUrl } from '../service/service-url.service';

@Component({
  selector: 'app-explore-properties',
  templateUrl: './explore-properties.component.html',
  styleUrls: ['./explore-properties.component.scss']
})
export class ExplorePropertiesComponent implements OnInit {
isMenuOpen = false;
projectList:any;
projectDataList:any;
  constructor(private router: Router,
      private brickntrackService: brickntrackService,
      private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.getAllActiveProjects()
  }
   toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }




   getAllActiveProjects() {
      debugger
      this.brickntrackService.get<any>(null, ServiceUrl.getAllActiveProject)
        .subscribe(
          (res) => {
            this.projectList = res
            this.getAllProjectDataDetail();
          },
          (err) => {
            Swal.fire("", err.error.message, "error")
          }
        )
    }
   getAllProjectDataDetail() {
      debugger
      this.brickntrackService.get<any>(null, ServiceUrl.getAllProjectDataDetail)
        .subscribe(
          (res) => {
            this.projectDataList = res

              this.projectList = this.projectList.map((project: { projectId: any; }) => {
          const relatedMedia = this.projectDataList.filter((data: { projectId: any; }) => data.projectId === project.projectId);
          return {
            ...project,
            media: relatedMedia
          };
        });

          },
          (err) => {
            Swal.fire("", err.error.message, "error")
          }
        )
    }
  sanitizeImagePath(path: string): string {
  if (!path) return 'assets/images/no-image.jpg'; // fallback image

  // Example: Replace local path with public server URL
  return path.replace("D://BrickNTrack//", "https://yourdomain.com/assets/").replace(/\\/g, "/");
}

getProjectImagePath(project: any): string {
  if (project.media && project.media.length > 0) {
    return this.sanitizeImagePath(project.media[0].path);
  }
  return 'assets/images/no-image.jpg'; // default image
}

  }

