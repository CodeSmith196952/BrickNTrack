import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-property-card',
  template: `
    <div class="pcard" [class.h-100]="stretch">
      <!-- Image -->
      <div class="pcard-img">
        <img *ngIf="property?.profileImage" [src]="property.profileImage" [alt]="property?.projectName">
        <div *ngIf="!property?.profileImage" class="pcard-placeholder">
          <i class="fa-solid fa-building"></i>
        </div>
        <span class="badge-featured" *ngIf="property?.isFeatured">Featured</span>
        <span class="badge-type" *ngIf="property?.propertyType">{{ property.propertyType }}</span>
        <span class="badge-status" [ngClass]="{
          'status-new': property?.status === 'New',
          'status-progress': property?.status === 'In Progress',
          'status-done': property?.status === 'Completed'
        }">{{ property?.status }}</span>
      </div>

      <!-- Content -->
      <div class="pcard-body">
        <h6 class="pcard-title">{{ property?.projectName }}</h6>
        <p class="pcard-address"><i class="fa-solid fa-location-dot me-1"></i>{{ property?.projectAddress }}</p>

        <div class="pcard-specs" *ngIf="property?.bedrooms || property?.bathrooms || property?.areaSqFt">
          <span *ngIf="property?.bedrooms"><i class="fa-solid fa-bed me-1"></i>{{ property.bedrooms }} BHK</span>
          <span *ngIf="property?.bathrooms"><i class="fa-solid fa-bath me-1"></i>{{ property.bathrooms }} Bath</span>
          <span *ngIf="property?.areaSqFt"><i class="fa-solid fa-ruler-combined me-1"></i>{{ property.areaSqFt }} sq.ft</span>
        </div>

        <!-- Progress -->
        <div class="pcard-progress" *ngIf="property?.completionPercentage">
          <div class="d-flex justify-content-between" style="font-size:11px;">
            <span class="text-muted">Progress</span>
            <span>{{ property.completionPercentage }}%</span>
          </div>
          <div class="progress" style="height:4px;">
            <div class="progress-bar bg-success" [style.width.%]="property.completionPercentage"></div>
          </div>
        </div>

        <!-- Builder + Status -->
        <div class="pcard-builder-row">
          <a class="pcard-builder" (click)="viewBuilder($event)">
            {{ property?.builderName || property?.builderMaster?.name || 'Builder' }}
            <i *ngIf="property?.isBuilderVerified" class="fa-solid fa-circle-check" style="color:#1da1f2; font-size:11px;"></i>
          </a>
        </div>

        <!-- Price -->
        <div class="pcard-price-row">
          <span class="pcard-price"><i class="fa-solid fa-indian-rupee-sign"></i> {{ property?.budget | number }}</span>
          <span class="pcard-psf" *ngIf="property?.pricePerSqFt">{{ property.pricePerSqFt | number }}/sq.ft</span>
        </div>

        <!-- Actions -->
        <div class="pcard-actions">
          <button class="btn btn-primary btn-sm flex-grow-1" (click)="viewDetails()">View Details</button>
          <button *ngIf="showEdit" class="btn btn-outline-secondary btn-sm" (click)="onEdit.emit(property)" title="Edit">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button *ngIf="showMilestones" class="btn btn-outline-info btn-sm" (click)="onMilestones.emit(property)" title="Milestones">
            <i class="fa-solid fa-flag"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .pcard {
      border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #fff;
      transition: all 0.25s cubic-bezier(0.4,0,0.2,1); display: flex; flex-direction: column;
      height: 100%;
    }
    .pcard:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); border-color: #c7d2fe; }

    .pcard-img { position: relative; height: 180px; overflow: hidden; flex-shrink: 0; }
    .pcard-img img { width: 100%; height: 100%; object-fit: cover; }
    .pcard-placeholder {
      width: 100%; height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex; align-items: center; justify-content: center;
    }
    .pcard-placeholder i { font-size: 40px; color: rgba(255,255,255,0.5); }

    .badge-featured { position: absolute; top: 8px; left: 8px; background: #f59e0b; color: #fff; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }
    .badge-type { position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.9); color: #334155; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; backdrop-filter: blur(4px); }
    .badge-status { position: absolute; bottom: 8px; left: 8px; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; color: #fff; }
    .status-new { background: #22c55e; }
    .status-progress { background: #f59e0b; }
    .status-done { background: #3b82f6; }

    .pcard-body { padding: 14px; display: flex; flex-direction: column; flex: 1; }
    .pcard-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
    .pcard-address { font-size: 12px; color: #64748b; margin-bottom: 8px; line-height: 1.4; }

    .pcard-specs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
    .pcard-specs span { font-size: 12px; color: #475569; background: #f1f5f9; padding: 2px 8px; border-radius: 6px; }

    .pcard-progress { margin-bottom: 8px; }

    .pcard-builder-row { margin-bottom: 8px; }
    .pcard-builder {
      font-size: 12px; color: #2563eb; background: #eff6ff; padding: 2px 10px; border-radius: 10px;
      cursor: pointer; text-decoration: none; display: inline-block;
    }
    .pcard-builder:hover { background: #dbeafe; }

    .pcard-price-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .pcard-price { font-size: 16px; font-weight: 700; color: #1e293b; }
    .pcard-psf { font-size: 11px; color: #94a3b8; }

    .pcard-actions { display: flex; gap: 6px; margin-top: auto; }
  `]
})
export class PropertyCardComponent {
  @Input() property: any;
  @Input() showEdit = false;
  @Input() showMilestones = false;
  @Input() stretch = true;
  @Output() onEdit = new EventEmitter<any>();
  @Output() onMilestones = new EventEmitter<any>();

  isLoggedIn = false;

  constructor(private router: Router, private auth: AuthService) {
    this.isLoggedIn = this.auth.isLoggedIn();
  }

  viewDetails(): void {
    if (!this.property?.projectId) return;
    const route = this.isLoggedIn
      ? ['/property/detail', this.property.projectId]
      : ['/propertyInformation', this.property.projectId];
    this.router.navigate(route);
  }

  viewBuilder(event: Event): void {
    event.stopPropagation();
    if (!this.property?.builderId) return;
    const route = this.isLoggedIn
      ? ['/builder/profile', this.property.builderId]
      : ['/builder-profile', this.property.builderId];
    this.router.navigate(route);
  }
}
