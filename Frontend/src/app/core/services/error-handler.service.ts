import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {

  handleError(error: any, customMessage?: string): void {
    const message = customMessage
      || error?.error?.message
      || error?.message
      || 'An unexpected error occurred';

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      toast: true,
      position: 'top-end',
      timer: 5000,
      showConfirmButton: false
    });
  }

  handleSuccess(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      toast: true,
      position: 'top-end',
      timer: 3000,
      showConfirmButton: false
    });
  }

  confirm(title: string, message: string): Promise<boolean> {
    return Swal.fire({
      title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(result => result.isConfirmed);
  }
}
