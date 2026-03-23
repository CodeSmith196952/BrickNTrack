import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { DestroyableComponent } from './destroyable.component';
import Swal from 'sweetalert2';

@Component({ template: '' })
export abstract class CrudBaseComponent<T> extends DestroyableComponent implements OnInit {
  items: T[] = [];
  form!: FormGroup;
  submitted = false;
  displayDialog = false;
  isEditMode = false;
  loading = false;
  title = '';

  protected abstract apiService: ApiService;
  protected abstract fb: FormBuilder;
  abstract get listEndpoint(): string;
  abstract get saveEndpoint(): string;
  abstract get entityName(): string;
  abstract buildForm(): FormGroup;

  ngOnInit(): void {
    this.form = this.buildForm();
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.apiService.get<T[]>(this.listEndpoint)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.items = res.data || (res as any);
          this.loading = false;
        },
        (err) => {
          let msg = 'Failed to load data';
          if (err.status === 401) msg = 'Session expired. Please login again.';
          else if (err.status === 403) msg = 'You do not have permission to access this.';
          else if (err.error?.message) msg = err.error.message;
          Swal.fire('', msg, 'error');
          this.loading = false;
        }
      );
  }

  openDialog(): void {
    this.displayDialog = true;
    this.isEditMode = false;
    this.submitted = false;
    this.resetForm();
    this.title = `Add ${this.entityName}`;
  }

  closeDialog(): void {
    this.displayDialog = false;
  }

  save(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const formData = this.form.value;

    this.apiService.post<any>(this.saveEndpoint, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          Swal.fire('', res.message, 'success');
          this.loadItems();
          this.displayDialog = false;
        },
        (err) => {
          Swal.fire('', err.error?.message || 'Operation failed', 'error');
        }
      );
  }

  resetForm(): void {
    this.submitted = false;
    this.form = this.buildForm();
  }

  acceptNumber(event: any, allowDecimal: boolean): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (allowDecimal) {
      if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
      }
    } else {
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
      }
    }
  }
}
