import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
userData = {
  userName: '',
  firstName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
  website: '',
  street: '',
  city: '',
  state: '',
  zip: ''
};

ngOnInit(): void {
  debugger
  const stored = sessionStorage.getItem('LoginResponse');
    if (stored) {
      try {
        const parsed = JSON.parse(stored); // First parse
        const user = parsed._value || {};   // Then access `_value`

        this.userData = {
          userName: user.userName || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          mobileNumber: user.mobileNumber || '',
          website: '', // not available
          street: '',
          city: '',
          state: '',
          zip: ''
        };

      } catch (err) {
        console.error('Failed to parse session storage user data', err);
      }
    }
  }
}
