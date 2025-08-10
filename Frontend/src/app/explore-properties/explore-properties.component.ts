import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-explore-properties',
  templateUrl: './explore-properties.component.html',
  styleUrls: ['./explore-properties.component.scss']
})
export class ExplorePropertiesComponent implements OnInit {
isMenuOpen = false;
  constructor() { }

  ngOnInit(): void {
  }
   toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
