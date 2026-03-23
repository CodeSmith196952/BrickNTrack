import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { Expense } from 'src/app/core/models/expense.model';
import { CrudBaseComponent } from 'src/app/shared/base/crud-base.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent extends CrudBaseComponent<Expense> implements OnInit {
  ActiveButtonVisible = false;
  ResetVisible: any;
  showMilestoneDialog = false;
  resetVisible = false;
  milestoneList: any;

  // Template aliases
  get expensesList() { return this.items; }
  set expensesList(val) { this.items = val; }
  get milestoneForm() { return this.form; }
  set milestoneForm(val) { this.form = val; }
  get displayProjectDialog() { return this.displayDialog; }
  set displayProjectDialog(val) { this.displayDialog = val; }

  protected apiService: ApiService;
  protected fb: FormBuilder;
  get listEndpoint() { return 'Expenses/getAllExpensesByMilestoneId'; }
  get saveEndpoint() { return 'Expenses/addUpdateExpenses'; }
  get entityName() { return 'Expenses'; }

  constructor(api: ApiService, private route: ActivatedRoute, fb: FormBuilder) {
    super();
    this.apiService = api;
    this.fb = fb;
  }

  buildForm(): FormGroup {
    return this.fb.group({
      expenseId: [''],
      vendorSupplier: [''],
      category: [''],
      amount: [''],
      details: [''],
      projectMilestoneId: [''],
    });
  }

  override ngOnInit(): void {
    this.form = this.buildForm();
    const milestoneId = this.route.snapshot.paramMap.get('id');
    if (milestoneId) {
      this.getAllActiveExpenses(milestoneId);
    }
    this.getAllActiveMilestone();
  }

  ResetDialog() {
    this.submitted = false;
    this.form.reset();
  }

  openProjectDialog() {
    this.displayDialog = true;
    this.ResetVisible = true;
    this.form.reset();
    this.ActiveButtonVisible = false;
    this.ResetDialog();
    this.title = 'Add Expenses';
  }

  closeProjectDialog() { this.displayDialog = false; }

  editexpenses(value: any) {
    this.title = 'Edit Expenses ';
    this.displayDialog = true;
    this.ActiveButtonVisible = true;
    this.ResetVisible = false;
    this.form.patchValue({
      expenseId: value.expenseId, projectMilestoneId: value.projectMilestoneId,
      amount: value.amount, category: value.category,
      vendorSupplier: value.vendorSupplier, details: value.details,
    });
  }

  saveProjectExpense() {
    this.submitted = true;
    if (this.form.invalid) return;

    // Bug fix: was previously calling 'Milestone/addUpdateMilestone'
    this.apiService.post<any>('Expenses/addUpdateExpenses', this.form.value)
      .pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
          Swal.fire('', res.message, 'success');
          this.showMilestoneDialog = false;
          const milestoneId = this.route.snapshot.paramMap.get('id');
          if (milestoneId) this.getAllActiveExpenses(milestoneId);
        },
        (err) => {
          Swal.fire('', err.error.errorMessage, 'error');
          this.showMilestoneDialog = false;
        }
      );
  }

  getAllActiveExpenses(milestoneId: string) {
    this.apiService.get<any>('Expenses/getAllExpensesByMilestoneId', { milestoneId })
      .pipe(takeUntil(this.destroy$)).subscribe(
        (res) => { this.items = res.data || res; },
        (err) => { Swal.fire('', err.error.message, 'error'); }
      );
  }

  getAllActiveMilestone() {
    this.apiService.get<any>('Milestone/getAllActiveMilestones')
      .pipe(takeUntil(this.destroy$)).subscribe(
        (res) => { this.milestoneList = res.data || res; },
        (err) => { Swal.fire('', err.error.message, 'error'); }
      );
  }
}
