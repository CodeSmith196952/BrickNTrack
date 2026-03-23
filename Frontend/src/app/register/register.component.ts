import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';
import { DestroyableComponent } from '../shared/base/destroyable.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends DestroyableComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  loading = false;
  selectedRole = 'Buyer';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    // Sync userName with email
    this.form.get('email')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => {
      this.form.get('userName')?.setValue(val, { emitEvent: false });
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      userName: ['', [Validators.required, Validators.email]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$^+=!*()@%&]).{6,}$')]],
      confirmPassword: ['', Validators.required],
      role: ['Buyer', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      // Builder-specific fields
      companyName: [''],
      gstNo: [''],
      officeAddress: [''],
      ownerName: [''],
      contact1: [''],
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onRoleChange(): void {
    this.selectedRole = this.form.get('role')?.value;
    if (this.selectedRole === 'Builder') {
      this.form.get('companyName')?.setValidators([Validators.required]);
      this.form.get('gstNo')?.setValidators([Validators.required]);
      this.form.get('officeAddress')?.setValidators([Validators.required]);
      this.form.get('ownerName')?.setValidators([Validators.required]);
      this.form.get('contact1')?.setValidators([Validators.required]);
    } else {
      this.form.get('companyName')?.clearValidators();
      this.form.get('gstNo')?.clearValidators();
      this.form.get('officeAddress')?.clearValidators();
      this.form.get('ownerName')?.clearValidators();
      this.form.get('contact1')?.clearValidators();
    }
    this.form.get('companyName')?.updateValueAndValidity();
    this.form.get('gstNo')?.updateValueAndValidity();
    this.form.get('officeAddress')?.updateValueAndValidity();
    this.form.get('ownerName')?.updateValueAndValidity();
    this.form.get('contact1')?.updateValueAndValidity();
  }

  register(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;
    const formData = this.form.value;

    // Set email as username if they match pattern
    if (!formData.userName) {
      formData.userName = formData.email;
    }

    this.api.post<any>('UserManager/Register', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      userName: formData.userName,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      password: formData.password,
      role: formData.role,
      acceptTerms: formData.acceptTerms,
      builderId: 0
    }).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.loading = false;
        const isBuilder = formData.role === 'Builder';
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: isBuilder
            ? 'Account created! Please login and set up your company profile from Builder Master.'
            : 'Your account has been created. Please login.',
          confirmButtonText: 'Go to Login'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      (err) => {
        this.loading = false;
        let msg = 'Registration failed. Please try again.';
        if (err.error?.message) {
          msg = err.error.message;
        } else if (err.error?.errors) {
          // Handle ASP.NET validation error format
          const errors = err.error.errors;
          msg = Object.values(errors).flat().join('. ');
        }
        Swal.fire({ icon: 'error', title: 'Error', text: msg });
      }
    );
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) return;
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
