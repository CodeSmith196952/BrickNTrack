import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-saved-properties',
  templateUrl: './saved-properties.component.html',
  styleUrls: ['./saved-properties.component.scss']
})
export class SavedPropertiesComponent implements OnInit, OnDestroy {
  savedProperties: any[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadSaved();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSaved(): void {
    this.loading = true;
    this.api.get<any[]>('SavedProperty')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.savedProperties = res.data || [];
          this.loading = false;
        },
        () => { this.loading = false; }
      );
  }

  unsave(projectId: number): void {
    Swal.fire({
      title: 'Remove?',
      text: 'Remove this property from saved list?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.delete(`SavedProperty/${projectId}`)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.savedProperties = this.savedProperties.filter(p => p.projectId !== projectId);
            Swal.fire({ icon: 'success', title: 'Removed', timer: 1200, showConfirmButton: false });
          });
      }
    });
  }
}
