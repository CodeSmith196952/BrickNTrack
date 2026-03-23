import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import Swal from 'sweetalert2';
import { UserScreenAccesData } from '../service/user-model.service';

interface PendingMedia {
  file: File;
  preview: string;
  name: string;
  category: string;
}

interface UnitConfig {
  id: number;
  unitName: string;
  unitType: string;
  bedrooms: number;
  bathrooms: number;
  carpetArea: number;
  superBuiltUpArea: number;
  price: number;
  pricePerSqFt: number;
  facingDirection: string;
  furnishingStatus: string;
  floorNumber: number;
  totalFloors: number;
  parkingCount: number;
  balconyCount: number;
  totalUnits: number;
  availableUnits: number;
  floorPlanFile: File | null;
  floorPlanPreview: string;
  floorPlanImage: string;
}

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss']
})
export class AddPropertyComponent implements OnInit {
  projectForm!: FormGroup;
  projectList: any;
  submitted = false;
  displayProjectDialog = false;
  ActiveButtonVisible = false;
  ResetVisible: any;
  isEditMode = false;

  selectedImageFile: File | null = null;

  selectedProject: ProjectMilestoneRequest | null = null;
  showMilestoneDialog = false;
  milestoneForm!: FormGroup;
  resetVisible = false;

  public userAccessData: any = new UserScreenAccesData();
  title!: string;
  builderList: any;
  averageBudget: any;
  length: any;
  activeCount: any;
  underConstructionCount: any;

  // Tabs
  activeTab: 'basic' | 'location' | 'features' | 'media' = 'basic';

  // Media
  pendingMediaFiles: PendingMedia[] = [];
  existingMedia: any[] = [];

  // Unit Configurations
  unitConfigs: UnitConfig[] = [];

  // Options
  facingOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];

  // Amenities
  allAmenities: any[] = [];
  amenitiesByCategory: { [key: string]: any[] } = {};
  selectedAmenityIds: number[] = [];

  constructor(private router: Router, private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getAllActiveProjects();
    this.ResetProjectForm();
    this.loadAmenities();
  }

  loadAmenities(): void {
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

  ResetProjectForm() {
    this.projectForm = this.fb.group({
      projectId: [''],
      projectName: [''],
      budget: [''],
      completionDate: [''],
      startDate: [''],
      completionPercentage: [0],
      status: ['New'],
      reraNumber: [''],
      hmdaNumber: [''],
      dtcpNumber: [''],
      approvalType: [''],
      isReraApproved: [false],
      isHmdaApproved: [false],
      isDtcpApproved: [false],
      projectAddress: [''],
      latitude: [''],
      longitude: [''],
      city: [''],
      state: [''],
      locality: [''],
      pincode: [''],
      projectDescription: [''],
      propertyType: [''],
      bedrooms: [''],
      bathrooms: [''],
      areaSqFt: [''],
      pricePerSqFt: [''],
      carpetArea: [''],
      superBuiltUpArea: [''],
      furnishingStatus: [''],
      facingDirection: [''],
      possessionStatus: [''],
      floorNumber: [''],
      totalFloors: [''],
      parkingCount: [''],
      balconyCount: [''],
      transactionType: [''],
      amenities: [''],
      isGatedCommunity: [false],
      isFeatured: [false],
      brochureUrl: [''],
      videoTourUrl: ['']
    });
  }

  ResetDialog() {
    this.submitted = false;
    this.ResetProjectForm();
    this.pendingMediaFiles = [];
    this.existingMedia = [];
    this.unitConfigs = [];
    this.activeTab = 'basic';
    this.selectedImageFile = null;
    this.selectedAmenityIds = [];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
    }
  }

  // ===== Media Handling =====
  onMediaFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processMediaFiles(Array.from(input.files));
    }
  }

  onMediaDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.processMediaFiles(Array.from(event.dataTransfer.files));
    }
  }

  private processMediaFiles(files: File[]): void {
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('', `${file.name} exceeds 5MB limit`, 'warning');
        continue;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.pendingMediaFiles.push({
          file,
          preview: e.target?.result as string,
          name: file.name.replace(/\.[^.]+$/, ''),
          category: 'Exterior'
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removePendingMedia(index: number): void {
    this.pendingMediaFiles.splice(index, 1);
  }

  // ===== Unit Config =====
  addUnitConfig(): void {
    this.unitConfigs.push({
      id: 0,
      unitName: '',
      unitType: '',
      bedrooms: 0,
      bathrooms: 0,
      carpetArea: 0,
      superBuiltUpArea: 0,
      price: 0,
      pricePerSqFt: 0,
      facingDirection: '',
      furnishingStatus: '',
      floorNumber: 0,
      totalFloors: 0,
      parkingCount: 0,
      balconyCount: 0,
      totalUnits: 0,
      availableUnits: 0,
      floorPlanFile: null,
      floorPlanPreview: '',
      floorPlanImage: ''
    });
  }

  removeUnitConfig(index: number): void {
    this.unitConfigs.splice(index, 1);
  }

  onFloorPlanSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.unitConfigs[index].floorPlanFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.unitConfigs[index].floorPlanPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFloorPlan(index: number): void {
    this.unitConfigs[index].floorPlanFile = null;
    this.unitConfigs[index].floorPlanPreview = '';
  }

  // ===== Save =====
  saveProject() {
    this.submitted = true;
    if (this.projectForm.invalid) return;

    const projectIdVal = this.projectForm.get('projectId')?.value;
    if (!projectIdVal || projectIdVal === '') {
      this.projectForm.get('projectId')?.setValue(0);
    }

    // Derive approvalType from checkboxes
    const approvals: string[] = [];
    if (this.projectForm.get('isReraApproved')?.value) approvals.push('RERA');
    if (this.projectForm.get('isHmdaApproved')?.value) approvals.push('HMDA');
    if (this.projectForm.get('isDtcpApproved')?.value) approvals.push('DTCP');
    this.projectForm.get('approvalType')?.setValue(approvals.join(','));
    if (!this.projectForm.get('isReraApproved')?.value) this.projectForm.get('reraNumber')?.setValue('');
    if (!this.projectForm.get('isHmdaApproved')?.value) this.projectForm.get('hmdaNumber')?.setValue('');
    if (!this.projectForm.get('isDtcpApproved')?.value) this.projectForm.get('dtcpNumber')?.setValue('');

    const skipKeys = ['ProfileImage', 'isReraApproved', 'isHmdaApproved', 'isDtcpApproved'];
    const formValues = this.projectForm.value;
    const formData = new FormData();

    for (const key in formValues) {
      if (formValues.hasOwnProperty(key) && !skipKeys.includes(key)) {
        const val = formValues[key];
        if (val !== null && val !== undefined && val !== '') {
          formData.append(key, val);
        }
      }
    }

    if (this.selectedImageFile) {
      formData.append('ProfileImageFile', this.selectedImageFile);
    }

    // Append unit configs as JSON
    if (this.unitConfigs.length > 0) {
      formData.append('unitConfigsJson', JSON.stringify(this.unitConfigs.map(u => ({
        id: u.id,
        unitName: u.unitName,
        unitType: u.unitType,
        bedrooms: u.bedrooms,
        bathrooms: u.bathrooms,
        carpetArea: u.carpetArea,
        superBuiltUpArea: u.superBuiltUpArea,
        price: u.price,
        pricePerSqFt: u.pricePerSqFt,
        facingDirection: u.facingDirection,
        furnishingStatus: u.furnishingStatus,
        floorNumber: u.floorNumber,
        totalFloors: u.totalFloors,
        parkingCount: u.parkingCount,
        balconyCount: u.balconyCount,
        totalUnits: u.totalUnits,
        availableUnits: u.availableUnits
      }))));
      // Append floor plan files separately
      this.unitConfigs.forEach((u, i) => {
        if (u.floorPlanFile) {
          formData.append(`unitFloorPlan_${i}`, u.floorPlanFile);
        }
      });
    }

    this.api.post<any>('Project/addUpdateProject', formData).subscribe(
      (res) => {
        if (res.success) {
          const projectId = res.data?.projectId || projectIdVal;
          if (this.pendingMediaFiles.length > 0 && projectId) {
            this.uploadMediaFiles(projectId);
          }
          if (this.selectedAmenityIds.length > 0 && projectId) {
            this.api.post<any>(`Amenity/project/${projectId}`, this.selectedAmenityIds).subscribe();
          }
          Swal.fire('', res.message || 'Property saved successfully', 'success');
          this.getAllActiveProjects();
          this.displayProjectDialog = false;
        } else {
          Swal.fire('Error', res.message || (res as any).errorMessage || 'Unknown error', 'error');
        }
      },
      (err) => {
        console.error('Save property error:', err);
        const msg = err.error?.errorMessage || err.error?.message || err.error?.title || JSON.stringify(err.error?.errors || err.error) || 'Error saving property';
        Swal.fire('Error', msg, 'error');
      }
    );
  }

  private uploadMediaFiles(projectId: number): void {
    for (const media of this.pendingMediaFiles) {
      const formData = new FormData();
      formData.append('ProjectDataPathId', '0');
      formData.append('ProjectId', projectId.toString());
      formData.append('DataName', media.name);
      formData.append('Category', media.category);
      formData.append('ProfileDataFile', media.file);
      formData.append('FileType', media.file.type);

      this.api.post<any>('Project/addUpdatePropertyImages', formData).subscribe();
    }
  }

  private loadExistingMedia(projectId: number): void {
    this.api.get<any>('Project/getProjectDataDetailByProjectId', { projectId }).subscribe(res => {
      this.existingMedia = res.data || [];
    });
  }

  private loadUnitConfigs(projectId: number): void {
    this.api.get<any>('PropertySearch/' + projectId).subscribe(res => {
      if (res.data?.unitTypes) {
        this.unitConfigs = res.data.unitTypes.map((u: any) => ({
          id: u.id,
          unitName: u.unitName || '',
          unitType: u.unitType || '',
          bedrooms: u.bedrooms || 0,
          bathrooms: u.bathrooms || 0,
          carpetArea: u.carpetArea || 0,
          superBuiltUpArea: u.superBuiltUpArea || 0,
          price: u.price || 0,
          pricePerSqFt: u.pricePerSqFt || 0,
          facingDirection: u.facingDirection || '',
          furnishingStatus: u.furnishingStatus || '',
          floorNumber: u.floorNumber || 0,
          totalFloors: u.totalFloors || 0,
          parkingCount: u.parkingCount || 0,
          balconyCount: u.balconyCount || 0,
          totalUnits: u.totalUnits || 0,
          availableUnits: u.availableUnits || 0,
          floorPlanFile: null,
          floorPlanPreview: u.floorPlanImage || '',
          floorPlanImage: u.floorPlanImage || ''
        }));
      }
    });
  }

  acceptNumber(event: any, flag: boolean): void {
    if (flag) {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
      }
    } else {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
      }
    }
  }

  getAllActiveBuilders() {
    this.api.get<any>('Builder/getAllBuilder').subscribe(
      (res) => { this.builderList = res.data || res; },
      (err) => { Swal.fire('', err.error.message, 'error'); }
    );
  }

  openMilestoneDialog(projectId: number) {
    this.submitted = false;
    this.resetVisible = false;
    this.showMilestoneDialog = true;
    this.milestoneForm.reset({
      milestoneId: 0,
      projectId: projectId,
      milestoneName: '',
      milestoneDetails: '',
      budget: 0,
      budgetStatus: '',
      status: '',
      plannedStartDate: null,
      plannedTargetDate: null,
      plannedDuration: 0,
    });
  }

  closeMilestoneDialog() {
    this.showMilestoneDialog = false;
  }

  addNewProperty() {
    this.displayProjectDialog = true;
    this.ResetVisible = true;
    this.ActiveButtonVisible = false;
    this.isEditMode = false;
    this.ResetDialog();
    this.title = 'Add New Property';
  }

  openProjectDialog(project: any) {
    this.displayProjectDialog = true;
    this.ResetVisible = false;
    this.ActiveButtonVisible = true;
    this.isEditMode = true;
    this.title = 'Edit Property';
    this.activeTab = 'basic';
    this.pendingMediaFiles = [];

    this.projectForm.patchValue({
      projectId: project.projectId || '',
      projectName: project.projectName || '',
      budget: project.budget || '',
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      completionDate: project.completionDate ? project.completionDate.split('T')[0] : '',
      completionPercentage: project.completionPercentage || 0,
      status: project.status || 'New',
      reraNumber: project.reraNumber || '',
      hmdaNumber: project.hmdaNumber || '',
      dtcpNumber: project.dtcpNumber || '',
      approvalType: project.approvalType || '',
      isReraApproved: !!project.reraNumber,
      isHmdaApproved: !!project.hmdaNumber,
      isDtcpApproved: !!project.dtcpNumber,
      projectAddress: project.projectAddress || '',
      latitude: project.latitude || '',
      longitude: project.longitude || '',
      city: project.city || '',
      state: project.state || '',
      locality: project.locality || '',
      pincode: project.pincode || '',
      projectDescription: project.projectDescription || '',
      propertyType: project.propertyType || '',
      bedrooms: project.bedrooms || '',
      bathrooms: project.bathrooms || '',
      areaSqFt: project.areaSqFt || '',
      pricePerSqFt: project.pricePerSqFt || '',
      carpetArea: project.carpetArea || '',
      superBuiltUpArea: project.superBuiltUpArea || '',
      furnishingStatus: project.furnishingStatus || '',
      facingDirection: project.facingDirection || '',
      possessionStatus: project.possessionStatus || '',
      floorNumber: project.floorNumber || '',
      totalFloors: project.totalFloors || '',
      parkingCount: project.parkingCount || '',
      balconyCount: project.balconyCount || '',
      transactionType: project.transactionType || '',
      amenities: project.amenities || '',
      isGatedCommunity: project.isGatedCommunity || false,
      isFeatured: project.isFeatured || false,
      brochureUrl: project.brochureUrl || '',
      videoTourUrl: project.videoTourUrl || ''
    });

    // Load existing media, unit configs, and amenities
    if (project.projectId) {
      this.loadExistingMedia(project.projectId);
      this.loadUnitConfigs(project.projectId);
      this.loadProjectAmenities(project.projectId);
    }
  }

  private loadProjectAmenities(projectId: number): void {
    this.api.get<any[]>(`Amenity/project/${projectId}`).subscribe(res => {
      if (res.success && res.data) {
        this.selectedAmenityIds = res.data.map((a: any) => a.amenityId);
      }
    });
  }

  closeProjectDialog() {
    this.displayProjectDialog = false;
  }

  editProject(project: any) {
    this.router.navigate(['projectmilestone', project.projectId]);
  }

  getAllActiveProjects() {
    this.api.get<any>('Project/getAllProjectOfBuilder').subscribe(
      (res) => {
        const data = res.data || res;
        const activeProjects = data.filter((project: any) =>
          project.status === 'New' || project.status === 'UnderConstruction' || project.status === 'In Progress'
        );
        this.projectList = activeProjects;
        this.length = activeProjects.length;
        this.activeCount = activeProjects.filter((p: any) => p.status === 'New').length;
        this.underConstructionCount = activeProjects.filter((p: any) => p.status === 'UnderConstruction' || p.status === 'In Progress').length;
        const totalBudget = activeProjects.reduce((sum: number, project: any) => sum + (project.budget || 0), 0);
        this.averageBudget = activeProjects.length ? totalBudget / activeProjects.length : 0;
      },
      (err) => {
        Swal.fire('', err.error.message, 'error');
      }
    );
  }
}

export interface ProjectMilestoneRequest {
  milestoneId: number;
  projectId: number;
  milestoneName: string;
  milestoneDetails: string;
  budget: number;
  budgetStatus?: string;
  status: string;
  plannedStartDate?: Date;
  plannedTargetDate?: Date;
  plannedDuration: number;
}
