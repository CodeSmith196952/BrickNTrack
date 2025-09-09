import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';
import { brickntrackService } from 'src/app/service/brickntrack-service.service'; 
import { ServiceUrl } from 'src/app/service/service-url.service';
import { UserScreenAccesData } from 'src/app/service/user-model.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-master',
  templateUrl: './project-master.component.html',
  styleUrls: ['./project-master.component.scss']
})
export class ProjectMasterComponent {
  projectForm!: FormGroup;
  projectList: any;
  submitted = false;
  displayProjectDialog: boolean = false;
  ActiveButtonVisible: boolean = false
  ResetVisible: any;
selectedImageFile: File | null = null;

selectedProject: ProjectMilestoneRequest | null = null;
showMilestoneDialog: boolean = false;
milestoneForm!: FormGroup;

resetVisible = false;



  public userAccessData: any = new UserScreenAccesData();
  title!: string;
  builderList: any;
  constructor(private router: Router,
    private brickntrackService: brickntrackService,
    private fb: FormBuilder,


  ) {

    
    // this.userAccessData = this.PalletList.getUserScreenAccessMenu('palletmaster')

  }
  // public noWhitespaceValidator(control: FormControl) {
  //   const isWhitespace = (control.value || '').trim().length === 0;
  //   const isValid = !isWhitespace;
  //   return isValid ? null : { 'whitespace': true };
  // }



  ngOnInit(): void {
    this.getAllActiveProjects();
    //this.getAllActiveBuilders();
    this.ResetProjectForm();

    this.milestoneForm = this.fb.group({
      milestoneId: [0],
      projectId: [0, Validators.required],
      milestoneName: ['', Validators.required],
      milestoneDetails: [''],
      budget: [0, Validators.required],
      budgetStatus: [''],
      status: ['', Validators.required],
      plannedStartDate: [null],
      plannedTargetDate: [null],
      plannedDuration: [0, Validators.required],
    });
  }

  ResetProjectForm(){
    this.projectForm = this.fb.group({
      projectId: [''],

      projectName: ['',],
      budget: ['',],

      completionDate: [''],

      startDate: [''],
      completionPercentage: [0],
      status: ['New'],
      reraNumber: [''],
      projectAddress: [''],
      latlong: [''],
      projectDescription: ['']
      // ProfileImageFile: [''],

      // isActive: ['', []]
    });
  }


  ResetDialog() {
    this.submitted = false;

    this.ResetProjectForm();
  }


onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedImageFile = input.files[0];
  }
}


saveProject() {
  debugger;
  this.submitted = true;

  if (this.projectForm.invalid) return;

  // Custom validation
  if (this.brickntrackService.commonValidation(this.projectForm.get('projectId')?.value)) {
    this.projectForm.get('projectId')?.setValue(0);
    this.projectForm.get('IsActive')?.setValue(true);
  }

  const formValues = this.projectForm.value;
  const formData = new FormData();

  // Append all form fields except 'profileImage' to avoid duplication
  for (const key in formValues) {
    if (formValues.hasOwnProperty(key) && key !== 'ProfileImage') {
      formData.append(key, formValues[key]);
    }
  }

  // Append selected image file if available
  if (this.selectedImageFile) {
    formData.append('ProfileImageFile', this.selectedImageFile); // Match API expected key
  }

  // Submit form data
  this.brickntrackService.post<any>(ServiceUrl.addUpdateProject, formData).subscribe(
    (res) => {
      Swal.fire('', res.responseMessage, 'success');
      this.getAllActiveProjects();
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

    getAllActiveBuilders() {
      debugger
      this.brickntrackService.get<any>(null, ServiceUrl.getAllBuilder)
        .subscribe(
          (res) => {
            this.builderList = res
          },
          (err) => {
            Swal.fire("", err.error.message, "error")
          }
        )
    }

 openMilestoneDialog(projectId: number) {
  this.submitted = false;
  this.resetVisible = false;
  this.showMilestoneDialog = true;

  this.milestoneForm.reset({
    milestoneId: 0,
    projectId: projectId,
    milestoneName: '',
    milestoneDetails: '',
    budget: 0,
    budgetStatus: '',
    status: '',
    plannedStartDate: null,
    plannedTargetDate: null,
    plannedDuration: 0,
  });
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
    this.ActiveButtonVisible = false;
    this.ResetDialog();
    this.title = "Add Project"
  }

  closeProjectDialog() {
    this.displayProjectDialog = false;
  }
editProject(project: any) {
  this.router.navigate(['projectmilestone', project.projectId]);
}


   saveMilestone() {
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

}





export interface ProjectMilestoneRequest {
  milestoneId: number;
  projectId: number;
  milestoneName: string;
  milestoneDetails: string;
  budget: number;
  budgetStatus?: string;
  status: string;
  plannedStartDate?: Date;
  plannedTargetDate?: Date;
  plannedDuration: number;
}