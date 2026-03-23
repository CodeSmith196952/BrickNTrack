import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-property-compare',
  templateUrl: './property-compare.component.html',
  styleUrls: ['./property-compare.component.scss']
})
export class PropertyCompareComponent implements OnInit, OnDestroy {
  compareIds: number[] = [];
  properties: any[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  comparisonFields = [
    { key: 'budget', label: 'Price', format: 'currency' },
    { key: 'pricePerSqFt', label: 'Price/sq.ft', format: 'currency' },
    { key: 'areaSqFt', label: 'Area (sq.ft)', format: 'number' },
    { key: 'carpetArea', label: 'Carpet Area', format: 'number' },
    { key: 'superBuiltUpArea', label: 'Super Built-up', format: 'number' },
    { key: 'bedrooms', label: 'Bedrooms', format: 'text' },
    { key: 'bathrooms', label: 'Bathrooms', format: 'text' },
    { key: 'balconyCount', label: 'Balconies', format: 'text' },
    { key: 'floorNumber', label: 'Floor', format: 'text' },
    { key: 'totalFloors', label: 'Total Floors', format: 'text' },
    { key: 'parkingCount', label: 'Parking', format: 'text' },
    { key: 'furnishingStatus', label: 'Furnishing', format: 'text' },
    { key: 'facingDirection', label: 'Facing', format: 'text' },
    { key: 'propertyType', label: 'Type', format: 'text' },
    { key: 'transactionType', label: 'Transaction', format: 'text' },
    { key: 'ownershipType', label: 'Ownership', format: 'text' },
    { key: 'maintenanceCharges', label: 'Maintenance/month', format: 'currency' },
    { key: 'completionPercentage', label: 'Completion', format: 'percent' },
    { key: 'possessionStatus', label: 'Possession', format: 'text' },
    { key: 'isGatedCommunity', label: 'Gated Community', format: 'boolean' },
    { key: 'hasPowerBackup', label: 'Power Backup', format: 'boolean' },
    { key: 'hasWaterSupply', label: 'Water Supply', format: 'boolean' },
    { key: 'reraNumber', label: 'RERA', format: 'text' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.compareIds = JSON.parse(localStorage.getItem('compareProperties') || '[]');
    this.loadProperties();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProperties(): void {
    if (this.compareIds.length === 0) return;
    this.loading = true;
    this.properties = [];
    let loaded = 0;
    for (const id of this.compareIds) {
      this.api.get<any>(`PropertySearch/${id}`).pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.success && res.data) this.properties.push(res.data);
        loaded++;
        if (loaded === this.compareIds.length) this.loading = false;
      }, () => { loaded++; if (loaded === this.compareIds.length) this.loading = false; });
    }
  }

  removeProperty(id: number): void {
    this.compareIds = this.compareIds.filter(i => i !== id);
    this.properties = this.properties.filter(p => p.projectId !== id);
    localStorage.setItem('compareProperties', JSON.stringify(this.compareIds));
  }

  clearAll(): void {
    this.compareIds = [];
    this.properties = [];
    localStorage.removeItem('compareProperties');
  }

  formatValue(value: any, format: string): string {
    if (value === null || value === undefined) return '-';
    switch (format) {
      case 'currency': return '\u20B9' + Number(value).toLocaleString('en-IN');
      case 'number': return Number(value).toLocaleString('en-IN');
      case 'percent': return value + '%';
      case 'boolean': return value ? '\u2713 Yes' : '\u2717 No';
      default: return String(value);
    }
  }
}
