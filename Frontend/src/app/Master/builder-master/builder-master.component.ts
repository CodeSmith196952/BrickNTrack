import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Action } from 'rxjs/internal/scheduler/Action';
import { brickntrackService } from 'src/app/service/brickntrack-service.service'; 
import { ServiceUrl } from 'src/app/service/service-url.service';
import { UserScreenAccesData } from 'src/app/service/user-model.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-builder-master',
  templateUrl: './builder-master.component.html',
  styleUrls: ['./builder-master.component.scss']
})
export class BuilderMasterComponent {
  builderForm!: FormGroup;
  builderList: any;
  submitted = false;
  displayBuilderDialog: boolean = false;
  ActiveButtonVisible: boolean = false
  ResetVisible: any;



  public userAccessData: any = new UserScreenAccesData();
  title!: string;
  constructor(
    private brickntrackService: brickntrackService,
    private fb: FormBuilder,


  ) {

    this.builderForm = this.fb.group({
      builderId: [''],
      name: ['',],
      OwnerName: ['',],
      contact2: ['',],

      contact1: [''],

      tagLine: [''],
      description: [''],
      officeAddress: [''],
      emailAddress: [''],
      gstNo: [''],
      LangLog: [''],

      isActive: ['', []]



    });
    // this.userAccessData = this.PalletList.getUserScreenAccessMenu('palletmaster')

  }
  // public noWhitespaceValidator(control: FormControl) {
  //   const isWhitespace = (control.value || '').trim().length === 0;
  //   const isValid = !isWhitespace;
  //   return isValid ? null : { 'whitespace': true };
  // }



  ngOnInit(): void {
    this.getAllActiveBuilders();
  }


  ResetDialog() {
    this.submitted = false;

    this.builderForm.reset();
  }


  saveBuilder() {
debugger
    this.submitted = true;

    if (this.builderForm.invalid)
      return;

    if (this.brickntrackService.commonValidation(this.builderForm.get('builderId')?.value)) {
      this.builderForm.get('builderId')?.setValue(0);
      this.builderForm.get('isActive')?.setValue(true);
    }


    const formData = this.builderForm.value;

    this.brickntrackService.post<any>(ServiceUrl.addUpdateBuilder, formData)
      .subscribe(
        (res) => {
          Swal.fire("", res.responseMessage, "success");

          this.getAllActiveBuilders();
          this.displayBuilderDialog = false;
        },
        (err) => {

          Swal.fire("", err.error.errorMessage, "error");
          this.displayBuilderDialog = false;
        }
      )

  }
  acceptNumber(event: any, flag: boolean): void {
    flag ? this.brickntrackService.keyacceptnumberAndDot(event) : this.brickntrackService.keyPressNumbers(event)
  }

  openBuilderDialog() {
    debugger
    this.displayBuilderDialog = true;
    this.ResetVisible = true;
    this.ActiveButtonVisible = false;
    this.ResetDialog();
    this.title = "Add Builder"
  }

  closeBuilderDialog() {
    this.displayBuilderDialog = false;

  }
  editBuilder(value: any) {
    this.title = "Edit Builder ";
    this.displayBuilderDialog = true
    this.ActiveButtonVisible = true
    this.ResetVisible = false
    this.builderForm.patchValue({
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
      // IsActive: value.IsActive


    })


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

}
