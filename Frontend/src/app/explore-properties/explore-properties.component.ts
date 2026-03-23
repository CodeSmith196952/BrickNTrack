import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-explore-properties',
  templateUrl: './explore-properties.component.html',
  styleUrls: ['./explore-properties.component.scss']
})
export class ExplorePropertiesComponent implements OnInit {
  isMenuOpen = false;
  isLoggedIn = false;
  showMap = false;
  projectList: any[] = [];
  loading = false;

  // Autocomplete
  suggestions: any[] = [];
  showSuggestions = false;

  // Search filters
  searchText = '';
  propertyType = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  city = '';
  sortBy = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  // Filters
  showFilters = false;
  transactionType = '';
  possessionStatus = '';
  bedroomFilter: number | null = null;
  furnishingFilter = '';
  facingFilter = '';
  isGatedCommunity = false;
  reraApproved = false;
  hmdaApproved = false;
  dtcpApproved = false;
  minArea: number | null = null;
  maxArea: number | null = null;

  constructor(private router: Router, private api: ApiService, private auth: AuthService) {}

  compareCount = 0;
  savedPropertyIds: Set<number> = new Set();

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.searchProperties();
    this.updateCompareCount();
    if (this.isLoggedIn) this.loadSavedProperties();
  }

  loadSavedProperties(): void {
    this.api.get<any[]>('SavedProperty').subscribe(res => {
      if (res.success && res.data) {
        this.savedPropertyIds = new Set(res.data.map((p: any) => p.projectId));
      }
    });
  }

  isSaved(projectId: number): boolean {
    return this.savedPropertyIds.has(projectId);
  }

  toggleSave(project: any, event: Event): void {
    event.stopPropagation();
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.isSaved(project.projectId)) {
      this.api.delete(`SavedProperty/${project.projectId}`).subscribe(() => {
        this.savedPropertyIds.delete(project.projectId);
      });
    } else {
      this.api.post(`SavedProperty/${project.projectId}`, {}).subscribe(() => {
        this.savedPropertyIds.add(project.projectId);
      });
    }
  }

  updateCompareCount(): void {
    const ids: number[] = JSON.parse(localStorage.getItem('compareProperties') || '[]');
    this.compareCount = ids.length;
  }

  goToCompare(): void {
    this.router.navigate(['/property/compare']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  setPropertyType(type: string): void {
    this.propertyType = type;
    this.onSearch();
  }

  setTransactionType(type: string): void {
    this.transactionType = type;
    this.onSearch();
  }

  setPossessionStatus(status: string): void {
    this.possessionStatus = status;
    this.onSearch();
  }

  setBedroomFilter(value: number | null): void {
    this.bedroomFilter = value;
  }

  setFurnishing(value: string): void {
    this.furnishingFilter = value;
  }

  setFacing(value: string): void {
    this.facingFilter = value;
  }

  hasActiveFilters(): boolean {
    return !!(
      this.propertyType ||
      this.transactionType ||
      this.possessionStatus ||
      this.bedroomFilter !== null ||
      this.furnishingFilter ||
      this.facingFilter ||
      this.isGatedCommunity ||
      this.reraApproved ||
      this.hmdaApproved ||
      this.dtcpApproved ||
      this.minPrice ||
      this.maxPrice ||
      this.minArea ||
      this.maxArea ||
      this.searchText ||
      this.city
    );
  }

  clearAllFilters(): void {
    this.searchText = '';
    this.propertyType = '';
    this.transactionType = '';
    this.possessionStatus = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.minArea = null;
    this.maxArea = null;
    this.bedroomFilter = null;
    this.furnishingFilter = '';
    this.facingFilter = '';
    this.isGatedCommunity = false;
    this.reraApproved = false;
    this.hmdaApproved = false;
    this.dtcpApproved = false;
    this.city = '';
    this.sortBy = '';
    this.onSearch();
  }

  searchProperties(): void {
    this.loading = true;
    const params: any = {
      page: this.currentPage,
      pageSize: 12
    };
    if (this.searchText) params.searchText = this.searchText;
    if (this.propertyType) params.propertyType = this.propertyType;
    if (this.minPrice) params.minPrice = this.minPrice;
    if (this.maxPrice) params.maxPrice = this.maxPrice;
    if (this.city) params.city = this.city;
    if (this.sortBy) params.sortBy = this.sortBy;
    if (this.transactionType) params.transactionType = this.transactionType;
    if (this.possessionStatus) params.possessionStatus = this.possessionStatus;
    if (this.bedroomFilter !== null) {
      params.minBedrooms = this.bedroomFilter;
      if (this.bedroomFilter < 5) {
        params.maxBedrooms = this.bedroomFilter;
      }
    }
    if (this.furnishingFilter) params.furnishingStatus = this.furnishingFilter;
    if (this.facingFilter) params.facingDirection = this.facingFilter;
    if (this.minArea) params.minArea = this.minArea;
    if (this.maxArea) params.maxArea = this.maxArea;
    if (this.isGatedCommunity) params.isGatedCommunity = true;
    const approvalFilters: string[] = [];
    if (this.reraApproved) approvalFilters.push('RERA');
    if (this.hmdaApproved) approvalFilters.push('HMDA');
    if (this.dtcpApproved) approvalFilters.push('DTCP');
    if (approvalFilters.length) params.approvalType = approvalFilters.join(',');

    this.api.get<any>('PropertySearch/search', params).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.projectList = res.data.items || [];
          this.totalPages = res.data.totalPages || 1;
          this.totalCount = res.data.totalCount || 0;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // Fallback to old endpoint for backwards compatibility
        this.api.get<any[]>('Property/getAllActiveProject').subscribe(res => {
          if (res.success && res.data) {
            this.projectList = res.data;
            this.totalCount = this.projectList.length;
          }
        });
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.searchProperties();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.searchProperties();
  }

  onSearchInput(): void {
    const q = this.searchText?.trim();
    if (!q || q.length < 2) {
      this.suggestions = [];
      this.showSuggestions = false;
      return;
    }
    this.api.get<any[]>('PropertySearch/suggest', { q }).subscribe(res => {
      this.suggestions = (res as any).data || [];
      this.showSuggestions = this.suggestions.length > 0;
    });
  }

  selectSuggestion(suggestion: any): void {
    this.showSuggestions = false;
    if (suggestion.type === 'property') {
      this.router.navigate(
        this.isLoggedIn ? ['/property/detail', suggestion.id] : ['/propertyInformation', suggestion.id]
      );
    } else if (suggestion.type === 'builder') {
      this.router.navigate(
        this.isLoggedIn ? ['/builder/profile', suggestion.id] : ['/builder-profile', suggestion.id]
      );
    } else if (suggestion.type === 'location') {
      this.searchText = suggestion.text;
      this.onSearch();
    }
  }

  closeSuggestions(): void {
    setTimeout(() => this.showSuggestions = false, 200);
  }

  onMapPropertyClick(property: any): void {
    const route = this.isLoggedIn ? ['/property/detail', property.projectId] : ['/propertyInformation', property.projectId];
    this.router.navigate(route);
  }

  getProjectImagePath(project: any): string {
    if (project.profileImage) {
      return project.profileImage;
    }
    return 'assets/images/no-image.jpg';
  }

  getDisplayPrice(project: any): string {
    // Show unit price range if available, otherwise fall back to budget
    const minPrice = project.minUnitPrice;
    const maxPrice = project.maxUnitPrice;
    if (minPrice && maxPrice && minPrice > 0) {
      if (minPrice === maxPrice) {
        return this.formatPrice(minPrice);
      }
      return this.formatPrice(minPrice) + ' - ' + this.formatPrice(maxPrice);
    }
    return this.formatPrice(project.budget);
  }

  formatPrice(value: number): string {
    if (!value) return '0';
    if (value >= 10000000) {
      return (value / 10000000).toFixed(1).replace(/\.0$/, '') + ' Cr';
    }
    if (value >= 100000) {
      return (value / 100000).toFixed(1).replace(/\.0$/, '') + ' L';
    }
    return value.toLocaleString('en-IN');
  }

  onInquire(project: any): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/property/detail', project.projectId], { fragment: 'inquiry' });
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/property/detail/' + project.projectId } });
    }
  }
}
