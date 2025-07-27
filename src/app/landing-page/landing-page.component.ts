import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit,AfterViewInit {
 @ViewChild('ratesSection') ratesSection!: ElementRef;

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


   happyBuyers: number = 0;
  verifiedBuilders: number = 0;
  averageRating: number = 0;
  satisfactionRate: number = 0;

  animated = false;
  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.checkIfInView();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkIfInView();
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
