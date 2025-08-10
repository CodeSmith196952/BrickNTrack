import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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



  public userAccessData: any = new UserScreenAccesData();
  title!: string;
  constructor(
    private brickntrackService: brickntrackService,
    private fb: FormBuilder,


  ) {

    this.projectForm = this.fb.group({
      projectId: [''],

      projectName: ['',],
      builderName: ['',],
      budget: ['',],

      completionDate: [''],

      actualCompletionDate: [''],
      startDate: [''],
      actualStartDate: [''],
      completionPercentage: [''],
      status: [''],
      reraNumber: [''],
      projectAddress: [''],
      latlong: [''],
      projectDescription: [''],
      profileImage: [''],

      // isActive: ['', []]



    });
    // this.userAccessData = this.PalletList.getUserScreenAccessMenu('palletmaster')

  }
  // public noWhitespaceValidator(control: FormControl) {
  //   const isWhitespace = (control.value || '').trim().length === 0;
  //   const isValid = !isWhitespace;
  //   return isValid ? null : { 'whitespace': true };
  // }



  ngOnInit(): void {
    this.getAllActiveProjects();
  }


  ResetDialog() {
    this.submitted = false;

    this.projectForm.reset();
  }


  saveProject() {
debugger
    this.submitted = true;

    if (this.projectForm.invalid)
      return;

    if (this.brickntrackService.commonValidation(this.projectForm.get('projectId')?.value)) {
      this.projectForm.get('projectId')?.setValue(0);
      this.projectForm.get('IsActive')?.setValue(true);
    }


    const formData = this.projectForm.value;

    this.brickntrackService.post<any>(ServiceUrl.addUpdateProject, formData)
      .subscribe(
        (res) => {
          Swal.fire("", res.responseMessage, "success");

          this.getAllActiveProjects();
          this.displayProjectDialog = false;
        },
        (err) => {

          Swal.fire("", err.error.errorMessage, "error");
          this.displayProjectDialog = false;
        }
      )

  }
  acceptNumber(event: any, flag: boolean): void {
    flag ? this.brickntrackService.keyacceptnumberAndDot(event) : this.brickntrackService.keyPressNumbers(event)
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
  editProject(value: any) {
    this.title = "Edit Project ";
    this.displayProjectDialog = true
    this.ActiveButtonVisible = true
    this.ResetVisible = false
    this.projectForm.patchValue({
      projectId: value.projectId,
      projectName: value.projectName,
      builderName: value.builderName,
      budget: value.budget,
      completionDate: value.completionDate,
      actualCompletionDate: value.actualCompletionDate,
      startDate: value.startDate,
      actualStartDate: value.actualStartDate,
      completionPercentage: value.completionPercentage,
      status: value.status,
      reraNumber: value.reraNumber,
      projectAddress: value.projectAddress,
      latlong: value.latlong,
      projectDescription: value.projectDescription,
      profileImage: value.profileImage
    })


  }

  getAllActiveProjects() {
    debugger
    this.brickntrackService.get<any>(null, ServiceUrl.getAllActiveProject)
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
