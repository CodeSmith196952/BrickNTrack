import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
isMenuOpen = false;
  constructor() { }

  ngOnInit(): void {
  }
  @HostListener('window:scroll', [])

    toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
