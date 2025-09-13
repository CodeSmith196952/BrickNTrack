import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { brickntrackService } from 'src/app/service/brickntrack-service.service'; 
import Swal from 'sweetalert2';
import { ServiceUrl } from '../service/service-url.service';


@Component({
  selector: 'app-property-information',
  templateUrl: './property-information.component.html',
  styleUrls: ['./property-information.component.scss']
})
export class PropertyInformationComponent implements OnInit {
projectId!: number;
projectDetails: any;
projectImages: any[] = [];
 isViewerOpen = false;
  currentImageIndex = 0;
  is360Viewer = false;








  constructor(private route: ActivatedRoute,   private brickntrackService: brickntrackService,) { }

  ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
    this.projectId = +params.get('id')!;
    this.loadProjectDetails(this.projectId);
    this.loadProjectImages(this.projectId);
  });
  }
loadProjectDetails(id: number) {
  this.brickntrackService.get<any>(null, ServiceUrl.getAllActiveProject)
    .subscribe(res => {
      this.projectDetails = res.find((p: any) => p.projectId === id);
    });
}

loadProjectImages(id: number) {
  this.brickntrackService.get<any>(null, ServiceUrl.getAllProjectDataDetail)
    .subscribe(res => {
      this.projectImages = res.filter((img: any) => img.projectId === id);
    });
}

getImageUrl(path: string): string {
  if (!path) return 'assets/images/no-image.jpg';

  // Normalize backslashes to forward slashes
  path = path.replace(/\\/g, '/');

  // Extract relative path after "ProjectImagePath/"
  const index = path.indexOf('ProjectImagePath/');
  if (index === -1) return 'assets/images/no-image.jpg'; // fallback

  const relativePath = path.substring(index + 'ProjectImagePath/'.length);

  const baseUrl = 'https://yourdomain.com/ProjectImagePath/';
  return baseUrl + encodeURIComponent(relativePath);
}


isVideo(fileType: string): boolean {
  return fileType.toLowerCase() === '.mp4'; // Expand as needed
}

 openImageViewer(index: number) {
    this.currentImageIndex = index;
    this.is360Viewer = this.projectImages[index]?.category === '360';
    this.isViewerOpen = true;

    if (this.is360Viewer) {
      this.init360Viewer();
    }
  }

  closeImageViewer() {
    this.isViewerOpen = false;
    this.destroy360Viewer();
  }

  init360Viewer() {
    // If you have a 360 viewer library, initialize it here
    // For example, if using a simple 360 image with mouse drag:

    // Let's implement a super simple 360 viewer assuming
    // you have multiple images for the rotation stored in projectImages with category "360-frame"
    
    // Otherwise, if you have an equirectangular 360 image, use a library like Photo-Sphere-Viewer
  }

  destroy360Viewer() {
    // Clean up viewer if needed
  }

  openFullscreen(index: number) {
  const imgElement = document.createElement('img');
  imgElement.src = this.getImageUrl(this.projectImages[index].path);
  imgElement.style.width = '100%';
  imgElement.style.height = '100%';
  imgElement.style.objectFit = 'contain';
  imgElement.style.backgroundColor = 'black';

  document.body.appendChild(imgElement);

  // Use 'as any' cast to bypass TypeScript error for vendor-prefixed fullscreen methods
  const requestFullScreen =
    (imgElement as any).requestFullscreen ||
    (imgElement as any).webkitRequestFullscreen ||
    (imgElement as any).msRequestFullscreen;

  if (requestFullScreen) {
    requestFullScreen.call(imgElement);
  } else {
    alert('Fullscreen API is not supported in this browser.');
  }

  const exitHandler = () => {
    if (
      !document.fullscreenElement &&
      !(document as any).webkitFullscreenElement &&
      !(document as any).msFullscreenElement
    ) {
      imgElement.remove();
      document.removeEventListener('fullscreenchange', exitHandler);
      document.removeEventListener('webkitfullscreenchange', exitHandler);
      document.removeEventListener('MSFullscreenChange', exitHandler);
    }
  };

  document.addEventListener('fullscreenchange', exitHandler);
  document.addEventListener('webkitfullscreenchange', exitHandler);
  document.addEventListener('MSFullscreenChange', exitHandler);
}




}
