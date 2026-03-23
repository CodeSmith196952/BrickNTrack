import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ApiService, ServiceResult } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { DestroyableComponent } from '../shared/base/destroyable.component';
import Swal from 'sweetalert2';

interface CostMonitoring {
  projectId: number;
  projectName: string;
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  utilizationPercentage: number;
  stageWiseCosts: { stageName: string; budget: number; spent: number; milestoneId?: number }[];
  recentExpenses: any[];
}

@Component({
  selector: 'app-cost-monitoring-dashboard',
  templateUrl: './cost-monitoring-dashboard.component.html',
  styleUrls: ['./cost-monitoring-dashboard.component.scss']
})
export class CostMonitoringDashboardComponent extends DestroyableComponent implements OnInit {
  projects: CostMonitoring[] = [];
  selectedProject: CostMonitoring | null = null;
  loading = false;
  addExpenseMode = false;
  Math = Math;
  newExpense: any = { details: '', amount: 0, category: '', vendorSupplier: '', projectMilestoneId: '' };

  constructor(private api: ApiService, private auth: AuthService, private router: Router) { super(); }

  ngOnInit(): void {
    this.loadBuilderSummary();
  }

  loadBuilderSummary(): void {
    this.loading = true;
    this.api.get<CostMonitoring[]>('CostMonitoring/builder-summary').pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.projects = res.data;
          if (this.projects.length > 0) {
            this.selectProject(this.projects[0].projectId);
          }
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  selectProject(projectId: number): void {
    this.api.get<CostMonitoring>(`CostMonitoring/project/${projectId}`).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.success && res.data) {
        this.selectedProject = res.data;
      }
    });
  }

  get totalBudget(): number {
    return this.selectedProject?.totalBudget ?? 0;
  }

  get totalSpent(): number {
    return this.selectedProject?.totalSpent ?? 0;
  }

  get remaining(): number {
    return this.selectedProject?.remaining ?? 0;
  }

  get utilization(): number {
    return this.selectedProject?.utilizationPercentage ?? 0;
  }

  saveExpense(): void {
    if (!this.newExpense.details || !this.newExpense.amount) return;
    this.api.post<any>('Expenses/addUpdateExpenses', {
      expenseId: 0,
      details: this.newExpense.details,
      amount: this.newExpense.amount,
      category: this.newExpense.category,
      vendorSupplier: this.newExpense.vendorSupplier,
      projectMilestoneId: +this.newExpense.projectMilestoneId || 0
    }).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Expense Added', timer: 1500, showConfirmButton: false });
        this.addExpenseMode = false;
        this.newExpense = { details: '', amount: 0, category: '', vendorSupplier: '', projectMilestoneId: '' };
        if (this.selectedProject) this.selectProject(this.selectedProject.projectId);
      }
    }, err => {
      Swal.fire({ icon: 'error', title: 'Error', text: err.error?.message || 'Failed to add expense' });
    });
  }

  navigateToExpenses(stage: any): void {
    if (stage.milestoneId) {
      this.router.navigate(['/expenses', stage.milestoneId]);
    }
  }
}
