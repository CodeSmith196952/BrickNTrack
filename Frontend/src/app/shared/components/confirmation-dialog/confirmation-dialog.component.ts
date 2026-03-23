import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <p-dialog [header]="title" [(visible)]="visible" [modal]="true" [style]="{width: '400px'}">
      <p>{{ message }}</p>
      <ng-template pTemplate="footer">
        <button class="btn btn-secondary" (click)="onCancel()">Cancel</button>
        <button class="btn btn-danger" (click)="onConfirm()">{{ confirmText }}</button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-left: 8px; }
    .btn-secondary { background: #6c757d; color: #fff; }
    .btn-danger { background: #dc3545; color: #fff; }
  `]
})
export class ConfirmationDialogComponent {
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Input() confirmText = 'Yes';
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onCancel(): void {
    this.cancelled.emit();
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
