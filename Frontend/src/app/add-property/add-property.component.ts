import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { brickntrackService } from 'src/app/service/brickntrack-service.service'; 
import Swal from 'sweetalert2';
import { ServiceUrl } from '../service/service-url.service';
import { UserScreenAccesData } from '../service/user-model.service';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss']
})
export class AddPropertyComponent implements OnInit {
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
  averageBudget: any;
  length: any;
  activeCount: any;
  underConstructionCount: any;
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



closeMilestoneDialog() {
  this.showMilestoneDialog = false;
}

  openProjectDialog(project:any) {
    debugger
    this.displayProjectDialog = true;
    this.ResetVisible = true;
    this.ActiveButtonVisible = false;
    this.ResetDialog();
    this.projectForm.patchValue({
      projectId: project.projectId || '',
      projectName: project.projectName || '',
      budget: project.budget || '',
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      completionDate: project.completionDate ? project.completionDate.split('T')[0] : '',
      completionPercentage: project.completionPercentage || 0,
      status: project.status || 'New',
      reraNumber: project.reraNumber || '',
      projectAddress: project.projectAddress || '',
      latlong: project.latlong || '',
      projectDescription: project.projectDescription || ''
    });
  }

  closeProjectDialog() {
    this.displayProjectDialog = false;
  }
editProject(project: any) {
  this.router.navigate(['projectmilestone', project.projectId]);
}


 


  getAllActiveProjects() {
    debugger
    this.brickntrackService.get<any>(null, ServiceUrl.getAllProjectOfBuilder)
      .subscribe(
        (res) => {
           const activeProjects = res.filter((project: any) => 
          project.status === 'New' || project.status === 'UnderConstruction'
        );

        this.projectList = activeProjects;
        this.length = activeProjects.length;

        // Count "Active Listings"
        this.activeCount = activeProjects.filter((p: any) => p.status === 'New').length;

        // Count "Under Construction"
        this.underConstructionCount = activeProjects.filter((p: any) => p.status === 'UnderConstruction').length;

        // Calculate average budget
        const totalBudget = activeProjects.reduce((sum: number, project: any) => sum + (project.budget || 0), 0);
        this.averageBudget = activeProjects.length ? totalBudget / activeProjects.length : 0;
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