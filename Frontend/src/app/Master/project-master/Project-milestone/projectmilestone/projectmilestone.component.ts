import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { CrudBaseComponent } from 'src/app/shared/base/crud-base.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projectmilestone',
  templateUrl: './projectmilestone.component.html',
  styleUrls: ['./projectmilestone.component.scss']
})
export class ProjectmilestoneComponent extends CrudBaseComponent<any> implements OnInit {
  ActiveButtonVisible = false;
  ResetVisible: any;
  expandedProjectId: number | null = null;
  showMilestoneDialog = false;
  resetVisible = false;
  projectList: any;

  // Template aliases
  get milestoneList() { return this.items; }
  set milestoneList(val) { this.items = val; }
  get milestoneForm() { return this.form; }
  set milestoneForm(val) { this.form = val; }
  get displayProjectDialog() { return this.displayDialog; }
  set displayProjectDialog(val) { this.displayDialog = val; }

  protected apiService: ApiService;
  protected fb: FormBuilder;
  get listEndpoint() { return 'Milestone/getMilestonesByProjectId'; }
  get saveEndpoint() { return 'Milestone/addUpdateMilestone'; }
  get entityName() { return 'Milestone'; }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    api: ApiService,
    fb: FormBuilder
  ) {
    super();
    this.apiService = api;
    this.fb = fb;
  }

  buildForm(): FormGroup {
    return this.fb.group({
      projectId: [''],
      milestoneName: [''],
      milestoneId: [''],
      budget: [''],
      plannedTargetDate: [''],
      plannedStartDate: [''],
      plannedDuration: [''],
      milestoneDetails: [''],
      budgetStatus: [''],
      status: [''],
    });
  }

  override ngOnInit(): void {
    this.form = this.buildForm();
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.getAllActiveMilestone(projectId);
    }
  }

  ResetDialog() {
    this.submitted = false;
    this.form.reset();
  }

  saveMilestone() {
    this.submitted = true;
    if (this.form.invalid) return;

    const projectIdVal = this.form.get('projectId')?.value;
    if (!projectIdVal || projectIdVal === '') {
      this.form.get('projectId')?.setValue(0);
      this.form.get('IsActive')?.setValue(true);
    }

    this.apiService.post<any>('Milestone/addUpdateMilestone', this.form.value)
      .pipe(takeUntil(this.destroy$)).subscribe(
        (res) => { Swal.fire('', res.message, 'success'); this.displayDialog = false; },
        (err) => { Swal.fire('', err.error.errorMessage, 'error'); this.displayDialog = false; }
      );
  }

  resetMilestoneForm() {
    this.form.reset({
      milestoneId: 0, projectId: this.form.get('projectId')?.value || 0,
      milestoneName: '', milestoneDetails: '', budget: 0, budgetStatus: '',
      status: '', plannedStartDate: null, plannedTargetDate: null, plannedDuration: 0,
    });
    this.submitted = false;
    this.resetVisible = false;
  }

  closeMilestoneDialog() { this.showMilestoneDialog = false; }

  openProjectDialog() {
    this.displayDialog = true;
    this.ResetVisible = true;
    this.form.reset();
    this.ActiveButtonVisible = false;
    this.ResetDialog();
    this.title = 'Add Project';
  }

  closeProjectDialog() { this.displayDialog = false; }

  editProject(value: any) {
    this.title = 'Edit Milestone ';
    this.displayDialog = true;
    this.ActiveButtonVisible = true;
    this.ResetVisible = false;
    const plannedStartDate = value.plannedStartDate?.split('T')[0];
    const plannedTargetDate = value.plannedTargetDate?.split('T')[0];
    this.form.patchValue({
      milestoneId: value.milestoneId, projectId: value.projectId,
      milestoneName: value.milestoneName, milestoneDetails: value.milestoneDetails,
      plannedDuration: value.plannedDuration, budget: value.budget,
      plannedStartDate, plannedTargetDate, budgetStatus: value.budgetStatus,
      status: value.status,
    });
  }

  saveProjectExpense() {
    this.submitted = true;
    if (this.form.invalid) return;

    this.apiService.post<any>('Milestone/addUpdateMilestone', this.form.value)
      .pipe(takeUntil(this.destroy$)).subscribe(
        (res) => { Swal.fire('', res.message, 'success'); this.showMilestoneDialog = false; },
        (err) => { Swal.fire('', err.error.errorMessage, 'error'); this.showMilestoneDialog = false; }
      );
  }

  getAllActiveMilestone(projectId: string) {
    this.apiService.get<any>('Milestone/getMilestonesByProjectId', { projectId })
      .pipe(takeUntil(this.destroy$)).subscribe(
        (res) => { this.items = res.data || res; },
        (err) => { Swal.fire('', err.error.message, 'error'); }
      );
  }

  viewExpense(milestone: any) {
    this.router.navigate(['expenses', milestone.milestoneId]);
  }

  getAllActiveProjects() {
    this.apiService.get<any>('Project/getAllProjectOfBuilder')
      .pipe(takeUntil(this.destroy$)).subscribe(
        (res) => { this.projectList = res.data || res; },
        (err) => { Swal.fire('', err.error.message, 'error'); }
      );
  }

  toggleCard(projectId: number | null) {
    this.expandedProjectId = this.expandedProjectId === projectId ? null : projectId;
  }
}
