import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';


import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
    animations: [
    trigger('listAnimation', [
      transition(':enter', []), // Disable default enter
      transition('* => visible', [
        query('article', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ])
  ]
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {
 private intervalIds: any[] = [];
 private observer: IntersectionObserver | null = null;
 @ViewChild('ratesSection') ratesSection!: ElementRef;
 @ViewChild('storeSection', { static: true }) storeSection!: ElementRef;
  animationState = 'hidden';
  // Target values
  targetValues = {
    projectCount: 500,
    buyerCount: 50,
    transparencyScore: 99,
    transparencyScore2: 99
  };

  // Displayed values
  projectCount: number = 0;
  buyerCount: number = 0;
  transparencyScore: number = 0;
  transparencyScore2: number = 0;

isMenuOpen = false;
showPopup = true;
   happyBuyers: number = 0;
  verifiedBuilders: number = 0;
  averageRating: number = 0;
  satisfactionRate: number = 0;
visibleSlidesCount = 1
  animated = false;
  projectList: any;
  projectDataList: any;
  constructor(private router: Router,
      private api: ApiService,
      private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.getAllActiveProjects()
      // Auto close after 5 seconds
    // setTimeout(() => {
    //   this.showPopup = false;
    // }, 5000);
  }
  ngAfterViewInit(): void {

    
    this.checkIfInView();
    

 const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        this.animationState = 'visible';
        observer.disconnect(); // Trigger only once
      }
    }, { threshold: 0.3 }); // Adjust threshold as needed

    observer.observe(this.storeSection.nativeElement);
    this.observer = observer;
  
    
  }



  
  ngOnDestroy(): void {
    this.intervalIds.forEach(id => clearInterval(id));
    this.observer?.disconnect();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkIfInView();
  }
    toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

    closePopup(): void {
    this.showPopup = false;
  }

  checkIfInView() {
    const section = this.ratesSection.nativeElement;
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top <= windowHeight && rect.bottom >= 0 && !this.animated) {
      this.animateValue('projectCount', 500, 1000);
      this.animateValue('buyerCount', 50, 1500);
      this.animateValue('transparencyScore', 99, 1000);
      this.animateValue('transparencyScore2', 99, 1000);
      this.animated = true;
    }
  }

  animateValue(property: string, end: number, duration: number) {
    let start = 0;
    const range = end - start;
    let current = start;
    const increment = Math.ceil(range / (duration / 16)); // ~60fps
    const interval = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(interval);
      }
      (this as any)[property] = current;
    }, 16);
    this.intervalIds.push(interval);
  }


     getAllActiveProjects() {
        this.api.get<any>('PropertySearch/search', { page: 1, pageSize: 20 })
          .subscribe(
            (res) => {
              const data = res.data?.items || res.data || [];
              this.projectList = data;
              this.getAllProjectDataDetail();
            },
            () => {
              // Fallback: try the other endpoint
              this.api.get<any>('Property/getAllActiveProject').subscribe(
                (res) => {
                  this.projectList = res.data || [];
                },
                () => { this.projectList = []; }
              );
            }
          )
      }
     getAllProjectDataDetail() {
        // No-op: PropertySearch/search already provides the project data needed.
        // The previous Project/getAllProjectDataDetail endpoint requires AdminOrBuilder auth
        // and always fails on the public landing page.
        return;
      }
    sanitizeImagePath(path: string): string {
    if (!path) return '';
    return path.replace(/\\/g, '/');
  }
  
  getProjectImagePath(project: any): string {
    if (project.media && project.media.length > 0) {
      return this.sanitizeImagePath(project.media[0].path);
    }
    return 'assets/images/no-image.jpg'; // default image
  }
   get projectSlides(): any[][] {
    const chunkSize = 3;
    const slides: any[][] = [];

    const visibleProjects = this.projectList.slice(0, this.visibleSlidesCount * chunkSize);

    for (let i = 0; i < visibleProjects.length; i += chunkSize) {
      slides.push(visibleProjects.slice(i, i + chunkSize));
    }
    return slides;
  }

  viewMore() {
    this.visibleSlidesCount += 1;
  }

  get hasMoreProjects(): boolean {
    return this.visibleSlidesCount * 3 < this.projectList.length;
  }

}
