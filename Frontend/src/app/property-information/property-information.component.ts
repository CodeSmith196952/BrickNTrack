import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import Swal from 'sweetalert2';

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
  reviews: any[] = [];
  stages: any[] = [];
  isSaved = false;
  amenitiesList: any[] = [];
  showAllAmenities = false;
  isLoggedIn = false;
  selectedUnit: any = null;
  similarProperties: any[] = [];
  userRole = '';
  showUnitForm = false;
  editingUnit: any = { id: 0, projectId: 0, unitName: '', unitType: 'Apartment', bedrooms: 2, bathrooms: 2, carpetArea: 0, superBuiltUpArea: 0, price: 0, pricePerSqFt: 0, facingDirection: '', furnishingStatus: '', parkingCount: 1, balconyCount: 1, totalUnits: 0, availableUnits: 0 };

  // Appointment Dialog
  today = new Date().toISOString().split('T')[0];
  showAppointmentDialog = false;
  appointmentDate = '';
  appointmentTimeSlot = '';
  appointmentNotes = '';
  timeSlots = ['9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '12:00 PM - 1:00 PM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM'];

  // Edit Property Dialog
  showEditDialog = false;
  editTab: 'basic' | 'location' | 'features' | 'media' = 'basic';
  editForm!: FormGroup;
  editImageFile: File | null = null;
  facingOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];

  // Amenities
  allAmenities: any[] = [];
  amenitiesByCategory: { [key: string]: any[] } = {};
  selectedAmenityIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.userRole = this.auth.getUserRole();
    this.route.paramMap.subscribe(params => {
      this.projectId = +params.get('id')!;

      // If logged in and on public route, redirect to sidebar version
      if (this.isLoggedIn && this.router.url.startsWith('/propertyInformation/')) {
        this.router.navigate(['/property/detail', this.projectId]);
        return;
      }

      this.loadProjectDetails(this.projectId);
      this.loadProjectImages(this.projectId);
      this.loadReviews(this.projectId);
      this.loadStages(this.projectId);
      this.loadAllAmenities();
      if (this.isLoggedIn) {
        this.checkSaved(this.projectId);
      }
    });
  }

  loadProjectDetails(id: number): void {
    this.api.get<any>(`PropertySearch/${id}`).subscribe(res => {
      if (res.success && res.data) {
        this.projectDetails = res.data;
        this.trackRecentlyViewed(this.projectDetails);
        this.loadSimilarProperties();
        // Load amenities from new structured data or fallback to old string
        if (this.projectDetails.amenityList?.length) {
          this.amenitiesList = this.projectDetails.amenityList;
        } else if (this.projectDetails.amenities) {
          try {
            const parsed = JSON.parse(this.projectDetails.amenities);
            this.amenitiesList = parsed.map((a: string) => ({ name: a, icon: 'fa-solid fa-check', category: '' }));
          } catch {
            this.amenitiesList = this.projectDetails.amenities.split(',').map((a: string) => ({ name: a.trim(), icon: 'fa-solid fa-check', category: '' }));
          }
        }
      }
    });
  }

  loadProjectImages(id: number): void {
    this.api.get<any[]>('Project/getProjectDataDetailByProjectId', { projectId: id }).subscribe(res => {
      if (res.success && res.data) {
        this.projectImages = res.data;
      }
    });
  }

  loadReviews(id: number): void {
    this.api.get<any[]>(`Review/project/${id}`).subscribe(res => {
      if (res.success && res.data) {
        this.reviews = res.data;
      }
    });
  }

  loadStages(id: number): void {
    this.api.get<any[]>(`ConstructionProgress/project/${id}`).subscribe({
      next: (res) => {
        if (res.success && res.data) this.stages = res.data;
      },
      error: () => {}
    });
  }

  checkSaved(id: number): void {
    this.api.get<boolean>(`SavedProperty/check/${id}`).subscribe(res => {
      if (res.success) this.isSaved = res.data || false;
    });
  }

  toggleSave(): void {
    if (!this.isLoggedIn) {
      this.showLoginPrompt();
      return;
    }
    if (this.isSaved) {
      this.api.delete(`SavedProperty/${this.projectId}`).subscribe(() => {
        this.isSaved = false;
        Swal.fire({ icon: 'success', title: 'Removed', text: 'Property removed from saved list', timer: 1500, showConfirmButton: false });
      });
    } else {
      this.api.post(`SavedProperty/${this.projectId}`, {}).subscribe(() => {
        this.isSaved = true;
        Swal.fire({ icon: 'success', title: 'Saved!', text: 'Property saved. View it in your Saved Properties.', timer: 2000, showConfirmButton: false });
      });
    }
  }

  bookAppointment(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.appointmentDate = '';
    this.appointmentTimeSlot = '';
    this.appointmentNotes = '';
    this.showAppointmentDialog = true;
  }

  submitAppointment(): void {
    if (!this.appointmentDate || !this.appointmentTimeSlot) {
      Swal.fire('', 'Please select a date and time slot', 'warning');
      return;
    }
    const payload = {
      sellerUserId: this.projectDetails?.builderId || 0,
      projectId: this.projectId,
      scheduledDate: this.appointmentDate,
      timeSlot: this.appointmentTimeSlot,
      notes: this.appointmentNotes
    };
    this.api.post<any>('Appointment', payload).subscribe(
      (res) => {
        this.showAppointmentDialog = false;
        Swal.fire({ icon: 'success', title: 'Appointment Scheduled!', text: 'The builder will confirm your visit. You can check status in your Bookings page.', timer: 3000, showConfirmButton: true });
      },
      (err) => {
        Swal.fire('Error', err.error?.message || 'Failed to schedule appointment', 'error');
      }
    );
  }

  get averageRating(): number {
    if (!this.reviews.length) return 0;
    return Math.round(this.reviews.reduce((sum: number, r: any) => sum + r.overallRating, 0) / this.reviews.length * 10) / 10;
  }

  get canEditUnits(): boolean {
    return this.isLoggedIn && (this.userRole === 'Admin' || this.userRole === 'Builder');
  }

  openAddUnit(): void {
    this.editingUnit = { id: 0, projectId: this.projectId, unitName: '', unitType: 'Apartment', bedrooms: 2, bathrooms: 2, carpetArea: 0, superBuiltUpArea: 0, price: 0, pricePerSqFt: 0, facingDirection: '', furnishingStatus: '', parkingCount: 1, balconyCount: 1, totalUnits: 0, availableUnits: 0 };
    this.showUnitForm = true;
  }

  editUnit(unit: any, event: Event): void {
    event.stopPropagation();
    this.editingUnit = { ...unit };
    this.showUnitForm = true;
  }

  saveUnit(): void {
    this.editingUnit.projectId = this.projectId;
    this.api.post<any>('UnitType', this.editingUnit).subscribe(res => {
      if (res.success) {
        Swal.fire({ icon: 'success', title: this.editingUnit.id ? 'Updated' : 'Added', timer: 1500, showConfirmButton: false });
        this.showUnitForm = false;
        this.loadProjectDetails(this.projectId);
      }
    }, err => {
      Swal.fire({ icon: 'error', title: 'Error', text: err.error?.message || 'Failed' });
    });
  }

  deleteUnit(unit: any, event: Event): void {
    event.stopPropagation();
    Swal.fire({ title: 'Delete?', text: `Remove ${unit.unitName}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Delete' }).then(r => {
      if (r.isConfirmed) {
        this.api.delete(`UnitType/${unit.id}`).subscribe(() => {
          this.loadProjectDetails(this.projectId);
        });
      }
    });
  }

  getMinPrice(): number {
    if (!this.projectDetails?.unitTypes?.length) return 0;
    return Math.min(...this.projectDetails.unitTypes.map((u: any) => u.price));
  }

  getMaxPrice(): number {
    if (!this.projectDetails?.unitTypes?.length) return 0;
    return Math.max(...this.projectDetails.unitTypes.map((u: any) => u.price));
  }

  get hasDelayedStages(): boolean {
    return this.stages.some((s: any) => s.status === 'Delayed');
  }

  get overallCompletion(): number {
    if (!this.stages.length) return this.projectDetails?.completionPercentage || 0;
    return Math.round(this.stages.reduce((sum: number, s: any) => sum + s.completionPercentage, 0) / this.stages.length);
  }

  getImageUrl(path: string): string {
    if (!path) return 'assets/images/no-image.jpg';
    path = path.replace(/\\/g, '/');
    return path;
  }

  isVideo(fileType: string): boolean {
    return fileType?.toLowerCase() === 'mp4';
  }

  openImageViewer(index: number): void {
    this.currentImageIndex = index;
    this.isViewerOpen = true;
  }

  closeImageViewer(): void {
    this.isViewerOpen = false;
  }

  showLoginPrompt(): void {
    Swal.fire({
      title: 'Login Required',
      text: 'Please login or register to view contact details',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Login',
      cancelButtonText: 'Register',
      confirmButtonColor: '#1976d2',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.router.navigate(['/register']);
      }
    });
  }

  contactBuilder(): void {
    if (!this.isLoggedIn) {
      this.showLoginPrompt();
      return;
    }
    // Navigate to messaging with builder context
    this.router.navigate(['/messaging'], {
      queryParams: {
        builderId: this.projectDetails?.builderId,
        projectId: this.projectId,
        projectName: this.projectDetails?.projectName
      }
    });
  }

  shareProperty(): void {
    const url = window.location.origin + '/propertyInformation/' + this.projectId;
    const text = `Check out ${this.projectDetails?.projectName} on BrickNTrack`;

    if (navigator.share) {
      navigator.share({ title: this.projectDetails?.projectName, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        Swal.fire({ icon: 'success', title: 'Link Copied!', text: url, timer: 2000, showConfirmButton: false });
      });
    }
  }

  addToCompare(): void {
    const key = 'compareProperties';
    let ids: number[] = JSON.parse(localStorage.getItem(key) || '[]');
    if (ids.includes(this.projectId)) {
      Swal.fire({ icon: 'info', title: 'Already Added', text: 'This property is already in your comparison list', timer: 1500, showConfirmButton: false });
      return;
    }
    if (ids.length >= 4) {
      Swal.fire({ icon: 'warning', title: 'Limit Reached', text: 'You can compare up to 4 properties. Remove one first.' });
      return;
    }
    ids.push(this.projectId);
    localStorage.setItem(key, JSON.stringify(ids));
    Swal.fire({ icon: 'success', title: 'Added to Compare', text: `${ids.length} properties in comparison. Go to Compare page to see side-by-side.`, timer: 2000, showConfirmButton: false });
  }

  init360Viewer(): void {}
  destroy360Viewer(): void {}

  openFullscreen(index: number): void {
    const imgElement = document.createElement('img');
    imgElement.src = this.getImageUrl(this.projectImages[index].path);
    imgElement.style.width = '100%';
    imgElement.style.height = '100%';
    imgElement.style.objectFit = 'contain';
    imgElement.style.backgroundColor = 'black';
    document.body.appendChild(imgElement);
    const rfs = (imgElement as any).requestFullscreen || (imgElement as any).webkitRequestFullscreen;
    if (rfs) rfs.call(imgElement);
    const exitHandler = () => {
      if (!document.fullscreenElement) {
        imgElement.remove();
        document.removeEventListener('fullscreenchange', exitHandler);
      }
    };
    document.addEventListener('fullscreenchange', exitHandler);
  }

  get hasPropertyDetails(): boolean {
    if (!this.projectDetails) return false;
    return !!(this.projectDetails.carpetArea || this.projectDetails.superBuiltUpArea ||
      this.projectDetails.furnishingStatus || this.projectDetails.facingDirection ||
      this.projectDetails.floorNumber || this.projectDetails.parkingCount ||
      this.projectDetails.balconyCount || this.projectDetails.transactionType ||
      this.projectDetails.ownershipType || this.projectDetails.maintenanceCharges ||
      this.projectDetails.propertyAge || this.projectDetails.pricePerSqFt);
  }

  private trackRecentlyViewed(project: any): void {
    const key = 'recentlyViewed';
    let recent: any[] = JSON.parse(localStorage.getItem(key) || '[]');
    // Remove if already exists
    recent = recent.filter(p => p.projectId !== project.projectId);
    // Add to front
    recent.unshift({
      projectId: project.projectId,
      projectName: project.projectName,
      projectAddress: project.projectAddress,
      budget: project.budget,
      builderName: project.builderName,
      profileImage: project.profileImage
    });
    // Keep max 10
    recent = recent.slice(0, 10);
    localStorage.setItem(key, JSON.stringify(recent));
  }

  loadSimilarProperties(): void {
    if (!this.projectDetails) return;
    const params: any = { page: 1, pageSize: 3 };
    if (this.projectDetails.propertyType) params.propertyType = this.projectDetails.propertyType;
    if (this.projectDetails.city) params.city = this.projectDetails.city;
    this.api.get<any>('PropertySearch/search', params).subscribe(res => {
      if (res.success && res.data?.items) {
        this.similarProperties = res.data.items.filter((p: any) => p.projectId !== this.projectId).slice(0, 3);
      }
    });
  }

  // ===== Amenities =====
  loadAllAmenities(): void {
    this.api.get<any[]>('Amenity/all').subscribe(res => {
      if (res.success && res.data) {
        this.allAmenities = res.data;
        this.amenitiesByCategory = {};
        for (const a of this.allAmenities) {
          if (!this.amenitiesByCategory[a.category]) this.amenitiesByCategory[a.category] = [];
          this.amenitiesByCategory[a.category].push(a);
        }
      }
    });
  }

  get amenityCategories(): string[] {
    return Object.keys(this.amenitiesByCategory);
  }

  toggleAmenity(id: number): void {
    const idx = this.selectedAmenityIds.indexOf(id);
    if (idx >= 0) this.selectedAmenityIds.splice(idx, 1);
    else this.selectedAmenityIds.push(id);
  }

  isAmenitySelected(id: number): boolean {
    return this.selectedAmenityIds.includes(id);
  }

  // ===== Edit Property Dialog =====
  openEditPropertyDialog(): void {
    this.editTab = 'basic';
    this.editImageFile = null;
    const p = this.projectDetails;
    this.editForm = this.fb.group({
      projectId: [p.projectId],
      projectName: [p.projectName || ''],
      propertyType: [p.propertyType || ''],
      status: [p.status || 'New'],
      budget: [p.budget || ''],
      projectDescription: [p.projectDescription || ''],
      reraNumber: [p.reraNumber || ''],
      hmdaNumber: [p.hmdaNumber || ''],
      dtcpNumber: [p.dtcpNumber || ''],
      approvalType: [p.approvalType || ''],
      isReraApproved: [!!p.reraNumber],
      isHmdaApproved: [!!p.hmdaNumber],
      isDtcpApproved: [!!p.dtcpNumber],
      startDate: [p.startDate ? p.startDate.split('T')[0] : ''],
      completionDate: [p.completionDate ? p.completionDate.split('T')[0] : ''],
      completionPercentage: [p.completionPercentage || 0],
      projectAddress: [p.projectAddress || ''],
      city: [p.city || ''],
      state: [p.state || ''],
      locality: [p.locality || ''],
      pincode: [p.pincode || ''],
      latitude: [p.latitude || ''],
      longitude: [p.longitude || ''],
      bedrooms: [p.bedrooms || ''],
      bathrooms: [p.bathrooms || ''],
      areaSqFt: [p.areaSqFt || ''],
      pricePerSqFt: [p.pricePerSqFt || ''],
      carpetArea: [p.carpetArea || ''],
      superBuiltUpArea: [p.superBuiltUpArea || ''],
      furnishingStatus: [p.furnishingStatus || ''],
      facingDirection: [p.facingDirection || ''],
      possessionStatus: [p.possessionStatus || ''],
      floorNumber: [p.floorNumber || ''],
      totalFloors: [p.totalFloors || ''],
      parkingCount: [p.parkingCount || ''],
      parkingType: [p.parkingType || ''],
      balconyCount: [p.balconyCount || ''],
      transactionType: [p.transactionType || ''],
      ownershipType: [p.ownershipType || ''],
      maintenanceCharges: [p.maintenanceCharges || ''],
      propertyAge: [p.propertyAge || ''],
      amenities: [p.amenities || ''],
      isGatedCommunity: [p.isGatedCommunity || false],
      isFeatured: [p.isFeatured || false],
      hasPowerBackup: [p.hasPowerBackup || false],
      hasWaterSupply: [p.hasWaterSupply || false],
      brochureUrl: [p.brochureUrl || ''],
      videoTourUrl: [p.videoTourUrl || '']
    });

    // Load project amenities
    this.selectedAmenityIds = (p.amenityList || []).map((a: any) => a.amenityId);

    this.showEditDialog = true;
  }

  onEditImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.editImageFile = input.files[0];
    }
  }

  savePropertyEdit(): void {
    // Derive approvalType from checkboxes
    const approvals: string[] = [];
    if (this.editForm.get('isReraApproved')?.value) approvals.push('RERA');
    if (this.editForm.get('isHmdaApproved')?.value) approvals.push('HMDA');
    if (this.editForm.get('isDtcpApproved')?.value) approvals.push('DTCP');
    this.editForm.get('approvalType')?.setValue(approvals.join(','));
    if (!this.editForm.get('isReraApproved')?.value) this.editForm.get('reraNumber')?.setValue('');
    if (!this.editForm.get('isHmdaApproved')?.value) this.editForm.get('hmdaNumber')?.setValue('');
    if (!this.editForm.get('isDtcpApproved')?.value) this.editForm.get('dtcpNumber')?.setValue('');

    const skipKeys = ['isReraApproved', 'isHmdaApproved', 'isDtcpApproved'];
    const formValues = this.editForm.value;
    const formData = new FormData();
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key) && !skipKeys.includes(key)) {
        const val = formValues[key];
        if (val !== null && val !== undefined && val !== '') {
          formData.append(key, val);
        }
      }
    }
    if (this.editImageFile) {
      formData.append('ProfileImageFile', this.editImageFile);
    }

    this.api.post<any>('Project/addUpdateProject', formData).subscribe(
      (res) => {
        // Save amenities
        this.api.post<any>(`Amenity/project/${this.projectId}`, this.selectedAmenityIds).subscribe();

        Swal.fire({ icon: 'success', title: 'Updated', text: res.message, timer: 2000, showConfirmButton: false });
        this.showEditDialog = false;
        this.loadProjectDetails(this.projectId);
      },
      (err) => {
        Swal.fire('', err.error?.errorMessage || 'Error saving', 'error');
      }
    );
  }
}
