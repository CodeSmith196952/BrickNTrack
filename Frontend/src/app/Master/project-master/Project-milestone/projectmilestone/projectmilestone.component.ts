import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';
import { brickntrackService } from 'src/app/service/brickntrack-service.service'; 
import { ServiceUrl } from 'src/app/service/service-url.service';
import { UserScreenAccesData } from 'src/app/service/user-model.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projectmilestone',
  templateUrl: './projectmilestone.component.html',
  styleUrls: ['./projectmilestone.component.scss']
})
export class ProjectmilestoneComponent {
  projectForm!: FormGroup;
  milestoneList: any;
  submitted = false;
  displayProjectDialog: boolean = false;
  ActiveButtonVisible: boolean = false
  ResetVisible: any;
selectedImageFile: File | null = null;
expandedProjectId: number | null = null;

showMilestoneDialog: boolean = false;
milestoneForm!: FormGroup;

resetVisible = false;



  public userAccessData: any = new UserScreenAccesData();
  title!: string;
  builderList: any;
  projectList: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private brickntrackService: brickntrackService,
    private fb: FormBuilder,


  ) {

    this.milestoneForm = this.fb.group({
      projectId: [''],

      milestoneName: ['',],
      milestoneId: ['',],
      budget: ['',],

      plannedTargetDate: [''],

      plannedStartDate: [''],
      plannedDuration: [''],
      milestoneDetails: [''],
      budgetStatus: [''],
      status: [''],
    



    });
    // this.userAccessData = this.PalletList.getUserScreenAccessMenu('palletmaster')

  }
  // public noWhitespaceValidator(control: FormControl) {
  //   const isWhitespace = (control.value || '').trim().length === 0;
  //   const isValid = !isWhitespace;
  //   return isValid ? null : { 'whitespace': true };
  // }



  ngOnInit(): void {
debugger
     const projectId = this.route.snapshot.paramMap.get('id');
  if (projectId) {
    this.getAllActiveMilestone(projectId);
  }


    // this.getAllActiveMilestone();
  
    // this.getAllActiveProjects();


  }


  ResetDialog() {
    this.submitted = false;

    this.projectForm.reset();
  }




saveMilestone() {
  debugger;
  this.submitted = true;

  if (this.milestoneForm.invalid) return;

  // Custom validation
  if (this.brickntrackService.commonValidation(this.milestoneForm.get('projectId')?.value)) {
    this.milestoneForm.get('projectId')?.setValue(0);
    this.milestoneForm.get('IsActive')?.setValue(true);
  }

  const formValues = this.milestoneForm.value;


  // Submit form data
  this.brickntrackService.post<any>(ServiceUrl.addUpdateMilestone, formValues).subscribe(
    (res) => {
      Swal.fire('', res.responseMessage, 'success');
      // this.getAllActiveMilestone();
      this.displayProjectDialog = false;
    },
    (err) => {
      Swal.fire('', err.error.errorMessage, 'error');
      this.displayProjectDialog = false;
    }
  );
}
  acceptNumber(event: any, flag: boolean): void {
    flag ? this.brickntrackService.keyacceptnumberAndDot(event) : this.brickntrackService.keyPressNumbers(event)
  }

   



resetMilestoneForm() {
  this.milestoneForm.reset({
    milestoneId: 0,
    projectId: this.milestoneForm.get('projectId')?.value || 0,
    milestoneName: '',
    milestoneDetails: '',
    budget: 0,
    budgetStatus: '',
    status: '',
    plannedStartDate: null,
    plannedTargetDate: null,
    plannedDuration: 0,
  });
  this.submitted = false;
  this.resetVisible = false;
}

closeMilestoneDialog() {
  this.showMilestoneDialog = false;
}

  openProjectDialog() {
    debugger
    this.displayProjectDialog = true;
    this.ResetVisible = true;
    this.milestoneForm.reset()
    this.ActiveButtonVisible = false;
    this.ResetDialog();
    this.title = "Add Project"
  }

  closeProjectDialog() {
    this.displayProjectDialog = false;

  }
  editProject(value: any) {
    debugger
    this.title = "Edit Milestone ";
    this.displayProjectDialog = true
    this.ActiveButtonVisible = true
    this.ResetVisible = false
    const plannedStartDate = value.plannedStartDate?.split('T')[0];
  const plannedTargetDate = value.plannedTargetDate?.split('T')[0];
    this.milestoneForm.patchValue({
      milestoneId: value.milestoneId,
      projectId: value.projectId,
      milestoneName: value.milestoneName,
      milestoneDetails: value.milestoneDetails,
      plannedDuration: value.plannedDuration,
      budget: value.budget,
      plannedStartDate: plannedStartDate,
      plannedTargetDate: plannedTargetDate,
      budgetStatus: value.budgetStatus,
 
      status: value.status,
    
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
          // Refresh your milestone list here if needed
        },
        (err) => {
          Swal.fire('', err.error.errorMessage, 'error');
          this.showMilestoneDialog = false;
        }
      );
  }


getAllActiveMilestone(projectId: string) {
  debugger;
  const payload = { projectId };
  this.brickntrackService.get<any>(null,ServiceUrl.getMilestonesByProjectId,payload)
    .subscribe(
      (res) => {
        this.milestoneList = res;
      },
      (err) => {
        Swal.fire("", err.error.message, "error");
      }
    );
}



  viewExpense(milestone: any) {
    debugger
      this.router.navigate(['expenses', milestone.milestoneId]);

}

    getAllActiveProjects() {
      debugger
      this.brickntrackService.get<any>(null, ServiceUrl.getAllProjectOfBuilder)
        .subscribe(
          (res) => {
            this.projectList = res
          },
          (err) => {
            Swal.fire("", err.error.message, "error")
          }
        )
    }
  toggleCard(projectId: number | null) {
    if (this.expandedProjectId === projectId) {
      this.expandedProjectId = null; // collapse
    } else {
      this.expandedProjectId = projectId; // expand
    }
  }


}





