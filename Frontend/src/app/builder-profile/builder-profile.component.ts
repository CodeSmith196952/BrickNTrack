import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-builder-profile',
  templateUrl: './builder-profile.component.html',
  styleUrls: ['./builder-profile.component.scss']
})
export class BuilderProfileComponent implements OnInit {
  builder: any = null;
  projects: any[] = [];
  loading = false;
  builderId!: number;
  isLoggedIn = false;

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService, private auth: AuthService) {}

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

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.route.paramMap.subscribe(params => {
      this.builderId = +params.get('id')!;

      // If logged in and on the public route, redirect to sidebar version
      if (this.isLoggedIn && this.router.url.startsWith('/builder-profile/')) {
        this.router.navigate(['/builder/profile', this.builderId]);
        return;
      }

      this.loadBuilder();
      this.loadProjects();
    });
  }

  loadBuilder(): void {
    this.api.get<any>('Builder/getBuilderById', { builderId: this.builderId }).subscribe(res => {
      if (res.success && res.data) this.builder = res.data;
    });
  }

  loadProjects(): void {
    this.loading = true;
    this.api.get<any>('PropertySearch/search', { page: 1, pageSize: 100 }).subscribe({
      next: (res) => {
        const allProjects = res.data?.items || res.data || [];
        this.projects = allProjects.filter((p: any) => p.builderId === this.builderId);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
