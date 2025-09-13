import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';
import { brickntrackService } from 'src/app/service/brickntrack-service.service'; 
import { ServiceUrl } from 'src/app/service/service-url.service';
import { UserScreenAccesData } from 'src/app/service/user-model.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent {
  projectForm!: FormGroup;
  milestoneList: any;
  submitted = false;
  displayProjectDialog: boolean = false;
  ActiveButtonVisible: boolean = false
  ResetVisible: any;
selectedImageFile: File | null = null;


showMilestoneDialog: boolean = false;
milestoneForm!: FormGroup;

resetVisible = false;



  public userAccessData: any = new UserScreenAccesData();
  title!: string;
  builderList: any;
  projectList: any;
  expensesList: any;
  constructor(
    private brickntrackService: brickntrackService,
    private route: ActivatedRoute,
    private fb: FormBuilder,


  ) {

    this.milestoneForm = this.fb.group({
      expenseId: [''],

      vendorSupplier: ['',],
      category: ['',],
      amount: ['',],
      details: ['',],

      projectMilestoneId: [''],

    
    



    });
    // this.userAccessData = this.PalletList.getUserScreenAccessMenu('palletmaster')

  }
  // public noWhitespaceValidator(control: FormControl) {
  //   const isWhitespace = (control.value || '').trim().length === 0;
  //   const isValid = !isWhitespace;
  //   return isValid ? null : { 'whitespace': true };
  // }



  ngOnInit(): void {

       const milestoneId = this.route.snapshot.paramMap.get('id');
  if (milestoneId) {
    this.getAllActiveExpenses(milestoneId);
  }

   

    // this.getAllActiveExpenses();
  
    this.getAllActiveMilestone();


  }


  ResetDialog() {
    this.submitted = false;

    this.projectForm.reset();
  }





  acceptNumber(event: any, flag: boolean): void {
    flag ? this.brickntrackService.keyacceptnumberAndDot(event) : this.brickntrackService.keyPressNumbers(event)
  }

   






  openProjectDialog() {
    debugger
    this.displayProjectDialog = true;
    this.ResetVisible = true;
    this.milestoneForm.reset()
    this.ActiveButtonVisible = false;
    this.ResetDialog();
    this.title = "Add Expenses"
  }

  closeProjectDialog() {
    this.displayProjectDialog = false;

  }
  editexpenses(value: any) {
    this.title = "Edit Expenses ";
    this.displayProjectDialog = true
    this.ActiveButtonVisible = true
    this.ResetVisible = false
    this.milestoneForm.patchValue({
      expenseId: value.expenseId,
      projectMilestoneId: value.projectMilestoneId,
      amount: value.amount,
      category: value.category,
      vendorSupplier: value.vendorSupplier,
      details: value.details,
    
    
    })


  }


   saveProjectExpense() {
    debugger
    this.submitted = true;

    if (this.milestoneForm.invalid) {
      return;
    }

    const formData = this.milestoneForm.value;

    this.brickntrackService.post<any>(ServiceUrl.addUpdateMilestone, formData)
      .subscribe(
        (res) => {
          Swal.fire('', res.responseMessage, 'success');
          this.showMilestoneDialog = false;
          // this.getAllActiveExpenses()
        },
        (err) => {
          Swal.fire('', err.error.errorMessage, 'error');
          this.showMilestoneDialog = false;
        }
      );
  }


  getAllActiveExpenses(milestoneId : string) {
    debugger
      const payload = { milestoneId  };
    this.brickntrackService.get<any>(null, ServiceUrl.getAllExpensesByMilestoneId,payload)
      .subscribe(
        (res) => {
          this.expensesList = res
        },
        (err) => {
          Swal.fire("", err.error.message, "error")
        }
      )
  }


   getAllActiveMilestone() {
       debugger
       this.brickntrackService.get<any>(null, ServiceUrl.getAllActiveMilestones)
         .subscribe(
           (res) => {
             this.milestoneList = res
           },
           (err) => {
             Swal.fire("", err.error.message, "error")
           }
         )
     }
  

}





