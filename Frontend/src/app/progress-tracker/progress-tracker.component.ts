import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { DestroyableComponent } from '../shared/base/destroyable.component';

interface StageProgress {
  id: number;
  projectId: number;
  stageName: string;
  stageOrder: number;
  completionPercentage: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  notes?: string;
  status: string;
  stagePhotos: { id: number; photoPath: string; caption?: string }[];
}

@Component({
  selector: 'app-progress-tracker',
  templateUrl: './progress-tracker.component.html',
  styleUrls: ['./progress-tracker.component.scss']
})
export class ProgressTrackerComponent extends DestroyableComponent implements OnInit {
  stages: StageProgress[] = [];
  projects: any[] = [];
  selectedProjectId = 0;
  overallCompletion = 0;
  showAddDialog = false;
  loading = false;

  get completedCount(): number { return this.stages.filter(s => s.status === 'Completed').length; }
  get inProgressCount(): number { return this.stages.filter(s => s.status === 'In Progress').length; }
  get blockedCount(): number { return this.stages.filter(s => s.status === 'Delayed' || s.status === 'Blocked').length; }
  get pendingCount(): number { return this.stages.filter(s => s.status === 'Pending').length; }

  get blockedStages(): StageProgress[] { return this.stages.filter(s => s.status === 'Delayed' || s.status === 'Blocked'); }
  get inProgressStages(): StageProgress[] { return this.stages.filter(s => s.status === 'In Progress' || s.status === 'Pending'); }
  get completedStages(): StageProgress[] { return this.stages.filter(s => s.status === 'Completed'); }

  newStage = {
    projectId: 0, stageName: '', stageOrder: 0, completionPercentage: 0,
    plannedStartDate: null as string | null, plannedEndDate: null as string | null,
    actualStartDate: null as string | null, actualEndDate: null as string | null,
    notes: '', status: 'Pending'
  };

  stageStatuses = [
    { label: 'Pending', value: 'Pending' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Blocked', value: 'Blocked' },
    { label: 'Delayed', value: 'Delayed' }
  ];

  constructor(private api: ApiService, private auth: AuthService) { super(); }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.api.get<any[]>('Project/getAllActiveProjectOfBuilder').pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.success && res.data) {
        this.projects = res.data;
        if (this.projects.length > 0) {
          this.selectedProjectId = this.projects[0].projectId;
          this.loadStages();
        }
      }
    });
  }

  loadStages(): void {
    if (!this.selectedProjectId) return;
    this.loading = true;
    this.api.get<StageProgress[]>(`ConstructionProgress/project/${this.selectedProjectId}`).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.stages = res.data;
          this.overallCompletion = this.stages.length > 0
            ? Math.round(this.stages.reduce((sum, s) => sum + s.completionPercentage, 0) / this.stages.length)
            : 0;
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onProjectChange(): void {
    this.loadStages();
  }

  openAddDialog(): void {
    this.newStage = {
      projectId: this.selectedProjectId, stageName: '', stageOrder: this.stages.length + 1,
      completionPercentage: 0, plannedStartDate: null, plannedEndDate: null,
      actualStartDate: null, actualEndDate: null, notes: '', status: 'Pending'
    };
    this.showAddDialog = true;
  }

  saveStage(): void {
    this.api.post('ConstructionProgress', this.newStage).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.success) {
        this.showAddDialog = false;
        this.loadStages();
      }
    });
  }

  changeStatus(stage: StageProgress, newStatus: string): void {
    this.api.put(`ConstructionProgress/${stage.id}`, { ...stage, status: newStatus })
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          if (res.success) {
            stage.status = newStatus;
            if (newStatus === 'Completed') stage.completionPercentage = 100;
            this.overallCompletion = this.stages.length > 0
              ? Math.round(this.stages.reduce((sum, s) => sum + s.completionPercentage, 0) / this.stages.length)
              : 0;
          }
        }
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-progress';
      case 'Delayed': case 'Blocked': return 'status-delayed';
      default: return 'status-pending';
    }
  }
}
