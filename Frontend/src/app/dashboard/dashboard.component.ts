import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { DestroyableComponent } from '../shared/base/destroyable.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends DestroyableComponent implements OnInit {
  userRole = '';
  userName = '';
  builderDashboard: any = null;
  buyerDashboard: any = null;
  adminDashboard: any = null;
  projects: any[] = [];
  loading = false;

  constructor(private api: ApiService, private auth: AuthService) { super(); }

  ngOnInit(): void {
    this.userRole = this.auth.getUserRole();
    this.userName = this.auth.getUserDisplayName();
    this.loadDashboard();
    if (this.userRole === 'Builder' || this.userRole === 'Admin') {
      this.loadProjects();
    }
  }

  loadDashboard(): void {
    this.loading = true;
    const endpoint = this.userRole === 'Admin' ? 'Dashboard/admin'
      : this.userRole === 'Buyer' ? 'Dashboard/buyer'
      : 'Dashboard/builder';

    this.api.get<any>(endpoint).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          if (this.userRole === 'Admin') this.adminDashboard = res.data;
          else if (this.userRole === 'Buyer') this.buyerDashboard = res.data;
          else this.builderDashboard = res.data;
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadProjects(): void {
    this.api.get<any>('Project/getAllProjectOfBuilder').pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.projects = res.data || [];
    });
  }

  get budgetUtilization(): number {
    if (!this.builderDashboard?.totalBudget) return 0;
    return Math.round(this.builderDashboard.totalSpent / this.builderDashboard.totalBudget * 100);
  }
}
