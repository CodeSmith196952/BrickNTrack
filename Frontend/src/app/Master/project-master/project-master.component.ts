import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { Project } from 'src/app/core/models/project.model';
import { CrudBaseComponent } from 'src/app/shared/base/crud-base.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-master',
  templateUrl: './project-master.component.html',
  styleUrls: ['./project-master.component.scss']
})
export class ProjectMasterComponent extends CrudBaseComponent<Project> implements OnInit {
  ActiveButtonVisible = false;
  ResetVisible: any;
  selectedImageFile: File | null = null;
  selectedProject: any = null;
  showMilestoneDialog = false;
  milestoneForm!: FormGroup;
  resetVisible = false;
  searchTerm = '';

  // Amenities
  allAmenities: any[] = [];
  amenitiesByCategory: { [key: string]: any[] } = {};
  selectedAmenityIds: number[] = [];

  get amenityCategories(): string[] { return Object.keys(this.amenitiesByCategory); }
  toggleAmenity(id: number): void { const idx = this.selectedAmenityIds.indexOf(id); if (idx >= 0) this.selectedAmenityIds.splice(idx, 1); else this.selectedAmenityIds.push(id); }
  isAmenitySelected(id: number): boolean { return this.selectedAmenityIds.includes(id); }

  get filteredProjects(): any[] {
    if (!this.searchTerm?.trim()) return this.projectList || [];
    const term = this.searchTerm.toLowerCase();
    return (this.projectList || []).filter((p: any) =>
      p.projectName?.toLowerCase().includes(term) ||
      p.projectAddress?.toLowerCase().includes(term) ||
      p.status?.toLowerCase().includes(term)
    );
  }

  // Template aliases
  get projectList() { return this.items; }
  set projectList(val) { this.items = val; }
  get projectForm() { return this.form; }
  set projectForm(val) { this.form = val; }
  get displayProjectDialog() { return this.displayDialog; }
  set displayProjectDialog(val) { this.displayDialog = val; }

  builderList: any;
  activeTab: 'basic' | 'location' | 'features' | 'media' = 'basic';
  facingOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
  protected apiService: ApiService;
  protected fb: FormBuilder;
  get listEndpoint() { return 'Project/getAllProjectOfBuilder'; }
  get saveEndpoint() { return 'Project/addUpdateProject'; }
  get entityName() { return 'Project'; }

  constructor(private router: Router, api: ApiService, fb: FormBuilder) {
    super();
    this.apiService = api;
    this.fb = fb;
  }

  buildForm(): FormGroup {
    return this.fb.group({
      projectId: [''],
      projectName: ['', Validators.required],
      budget: ['', Validators.required],
      completionDate: [''],
      startDate: [''],
      completionPercentage: [0, [Validators.min(0), Validators.max(100)]],
      status: ['New', Validators.required],
      reraNumber: [''],
      hmdaNumber: [''],
      dtcpNumber: [''],
      approvalType: [''],
      isReraApproved: [false],
      isHmdaApproved: [false],
      isDtcpApproved: [false],
      projectAddress: ['', Validators.required],
      latitude: [''],
      longitude: [''],
      city: [''],
      state: [''],
      locality: [''],
      pincode: [''],
      projectDescription: ['', Validators.required],
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
      parkingType: [''],
      balconyCount: [''],
      transactionType: [''],
      ownershipType: [''],
      maintenanceCharges: [''],
      amenities: [''],
      isGatedCommunity: [false],
      isFeatured: [false],
      hasPowerBackup: [false],
      hasWaterSupply: [false],
      brochureUrl: [''],
      videoTourUrl: [''],
      propertyAge: ['']
    });
  }

  override ngOnInit(): void {
    this.form = this.buildForm();
    this.loadItems();
    this.apiService.get<any[]>('Amenity/all').subscribe(res => {
      if (res.success && res.data) {
        this.allAmenities = res.data;
        this.amenitiesByCategory = {};
        for (const a of this.allAmenities) {
          if (!this.amenitiesByCategory[a.category]) this.amenitiesByCategory[a.category] = [];
          this.amenitiesByCategory[a.category].push(a);
        }
      }
    });
    this.milestoneForm = this.fb.group({
      milestoneId: [0],
      projectId: [0, Validators.required],
      milestoneName: ['', Validators.required],
      milestoneDetails: [''],
      budget: [0, Validators.required],
      budgetStatus: [''],
      status: ['', Validators.required],
      plannedStartDate: [null],
      plannedTargetDate: [null],
      plannedDuration: [0, Validators.required],
    });
  }

  ResetProjectForm() {
    this.form = this.buildForm();
  }

  ResetDialog() {
    this.submitted = false;
    this.ResetProjectForm();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
    }
  }

  saveProject() {
    this.submitted = true;
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;

    const projectIdValue = this.form.get('projectId')?.value;
    if (!projectIdValue || projectIdValue === '') {
      this.form.get('projectId')?.setValue(0);
      this.form.get('IsActive')?.setValue(true);
    }

    // Derive approvalType from checkboxes
    const approvals: string[] = [];
    if (this.form.get('isReraApproved')?.value) approvals.push('RERA');
    if (this.form.get('isHmdaApproved')?.value) approvals.push('HMDA');
    if (this.form.get('isDtcpApproved')?.value) approvals.push('DTCP');
    this.form.get('approvalType')?.setValue(approvals.join(','));

    // Clear number fields if unchecked
    if (!this.form.get('isReraApproved')?.value) this.form.get('reraNumber')?.setValue('');
    if (!this.form.get('isHmdaApproved')?.value) this.form.get('hmdaNumber')?.setValue('');
    if (!this.form.get('isDtcpApproved')?.value) this.form.get('dtcpNumber')?.setValue('');

    const skipKeys = ['ProfileImage', 'isReraApproved', 'isHmdaApproved', 'isDtcpApproved'];
    const formValues = this.form.value;
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

    this.apiService.post<any>('Project/addUpdateProject', formData)
      .pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
          // Save amenities
          const pid = this.form.get('projectId')?.value || res.data?.projectId;
          if (pid && this.selectedAmenityIds.length > 0) {
            this.apiService.post<any>(`Amenity/project/${pid}`, this.selectedAmenityIds).pipe(takeUntil(this.destroy$)).subscribe();
          }
          Swal.fire('', res.message, 'success');
          this.loadItems();
          this.displayDialog = false;
        },
        (err) => {
          Swal.fire('', err.error.message, 'error');
          this.displayDialog = false;
        }
      );
  }

  getAllActiveBuilders() {
    this.apiService.get<any>('Builder/getAllBuilder')
      .pipe(takeUntil(this.destroy$)).subscribe(
        (res) => { this.builderList = res.data || res; },
        (err) => { Swal.fire('', err.error.message, 'error'); }
      );
  }

  openMilestoneDialog(projectId: number) {
    this.submitted = false;
    this.resetVisible = false;
    this.showMilestoneDialog = true;
    this.milestoneForm.reset({
      milestoneId: 0, projectId: projectId, milestoneName: '', milestoneDetails: '',
      budget: 0, budgetStatus: '', status: '', plannedStartDate: null,
      plannedTargetDate: null, plannedDuration: 0,
    });
  }

  resetMilestoneForm() {
    this.milestoneForm.reset({
      milestoneId: 0, projectId: this.milestoneForm.get('projectId')?.value || 0,
      milestoneName: '', milestoneDetails: '', budget: 0, budgetStatus: '',
      status: '', plannedStartDate: null, plannedTargetDate: null, plannedDuration: 0,
    });
    this.submitted = false;
    this.resetVisible = false;
  }

  closeMilestoneDialog() { this.showMilestoneDialog = false; }

  openProjectDialog() {
    this.openDialog();
    this.ResetVisible = true;
    this.ActiveButtonVisible = false;
    this.ResetProjectForm();
  }

  closeProjectDialog() { this.closeDialog(); }

  editProject(project: any) {
    this.router.navigate(['projectmilestone', project.projectId]);
  }

  editProjectDialog(project: any) {
    this.activeTab = 'basic';
    this.selectedAmenityIds = [];
    this.form = this.buildForm();
    this.form.patchValue({
      ...project,
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      completionDate: project.completionDate ? project.completionDate.split('T')[0] : '',
      isReraApproved: !!project.reraNumber,
      isHmdaApproved: !!project.hmdaNumber,
      isDtcpApproved: !!project.dtcpNumber,
    });
    // Load project amenities
    if (project.projectId) {
      this.apiService.get<any[]>(`Amenity/project/${project.projectId}`).subscribe(res => {
        if (res.success && res.data) this.selectedAmenityIds = res.data.map((a: any) => a.amenityId);
      });
    }
    this.displayDialog = true;
    this.ResetVisible = true;
    this.ActiveButtonVisible = true;
  }

  saveMilestone() {
    this.submitted = true;
    if (this.milestoneForm.invalid) return;
    this.apiService.post<any>('Milestone/addUpdateMilestone', this.milestoneForm.value)
      .pipe(takeUntil(this.destroy$)).subscribe(
        (res) => { Swal.fire('', res.message, 'success'); this.showMilestoneDialog = false; },
        (err) => { Swal.fire('', err.error.message, 'error'); this.showMilestoneDialog = false; }
      );
  }

  getAllActiveProjects() { this.loadItems(); }
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
