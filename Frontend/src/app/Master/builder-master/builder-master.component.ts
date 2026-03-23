import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Builder } from 'src/app/core/models/builder.model';
import { CrudBaseComponent } from 'src/app/shared/base/crud-base.component';

@Component({
  selector: 'app-builder-master',
  templateUrl: './builder-master.component.html',
  styleUrls: ['./builder-master.component.scss']
})
export class BuilderMasterComponent extends CrudBaseComponent<Builder> implements OnInit {
  ActiveButtonVisible = false;
  ResetVisible: any;
  userRole = '';
  myBuilder: any = null;

  get builderList() { return this.items; }
  set builderList(val) { this.items = val; }
  get builderForm() { return this.form; }
  set builderForm(val) { this.form = val; }
  get displayBuilderDialog() { return this.displayDialog; }
  set displayBuilderDialog(val) { this.displayDialog = val; }
  get isAdmin() { return this.userRole === 'Admin'; }

  protected apiService: ApiService;
  protected fb: FormBuilder;
  get listEndpoint() { return 'Builder/getAllActiveBuilder'; }
  get saveEndpoint() { return 'Builder/addUpdateBuilder'; }
  get entityName() { return 'Builder'; }

  constructor(api: ApiService, fb: FormBuilder, private auth: AuthService) {
    super();
    this.apiService = api;
    this.fb = fb;
  }

  buildForm(): FormGroup {
    return this.fb.group({
      builderId: [''],
      name: ['', Validators.required],
      OwnerName: ['', Validators.required],
      contact2: ['', Validators.required],
      contact1: ['', Validators.required],
      tagLine: ['', Validators.required],
      description: ['', Validators.required],
      officeAddress: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      gstNo: ['', Validators.required],
      LangLog: ['', Validators.required],
      isActive: ['', []]
    });
  }

  override ngOnInit(): void {
    this.form = this.buildForm();
    this.userRole = this.auth.getUserRole();

    if (this.isAdmin) {
      this.loadItems();
    } else {
      // Builder: load only their own profile
      this.loadItems();
    }
  }

  override loadItems(): void {
    this.loading = true;
    this.apiService.get<any[]>(this.listEndpoint)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          const all = res.data || (res as any);
          if (this.isAdmin) {
            this.items = all;
          } else {
            // Builder sees only their own builder profile
            const builderId = this.auth.getBuilderId();
            this.items = all.filter((b: any) => b.builderId === builderId);
            if (this.items.length > 0) {
              this.myBuilder = this.items[0];
            }
          }
          this.loading = false;
        },
        () => { this.loading = false; }
      );
  }

  saveBuilder() {
    this.submitted = true;
    if (this.form.invalid) return;

    const builderIdValue = this.form.get('builderId')?.value;
    if (!builderIdValue || builderIdValue === '') {
      this.form.get('builderId')?.setValue(0);
      this.form.get('isActive')?.setValue(true);
    }

    this.save();
  }

  openBuilderDialog() {
    this.openDialog();
    this.ResetVisible = true;
    this.ActiveButtonVisible = false;
  }

  closeBuilderDialog() {
    this.closeDialog();
  }

  ResetDialog() {
    this.resetForm();
  }

  editBuilder(value: any) {
    this.title = 'Edit Builder ';
    this.displayDialog = true;
    this.isEditMode = true;
    this.ActiveButtonVisible = true;
    this.ResetVisible = false;
    this.form.patchValue({
      builderId: value.builderId,
      name: value.name,
      OwnerName: value.ownerName,
      contact1: value.contact1,
      contact2: value.contact2,
      tagLine: value.tagLine,
      description: value.description,
      officeAddress: value.officeAddress,
      emailAddress: value.emailAddress,
      LangLog: value.langLog,
      gstNo: value.gstNo,
    });
  }

  getAllActiveBuilders() {
    this.loadItems();
  }
}
