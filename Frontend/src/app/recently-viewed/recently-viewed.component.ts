import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recently-viewed',
  templateUrl: './recently-viewed.component.html',
  styleUrls: ['./recently-viewed.component.scss']
})
export class RecentlyViewedComponent implements OnInit {
  recentProperties: any[] = [];

  ngOnInit(): void {
    this.recentProperties = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  }

  clearHistory(): void {
    localStorage.removeItem('recentlyViewed');
    this.recentProperties = [];
  }
}
