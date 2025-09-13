import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
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
export class AboutUsComponent {
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

  animated = false;
  constructor() { }

  ngOnInit(): void {
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
  }


  
}
