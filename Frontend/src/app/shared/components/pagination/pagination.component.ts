import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    <div class="pagination" *ngIf="totalPages > 1">
      <button (click)="changePage(currentPage - 1)" [disabled]="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button (click)="changePage(currentPage + 1)" [disabled]="currentPage === totalPages">Next</button>
    </div>
  `,
  styles: [`
    .pagination { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 16px 0; }
    button { padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; background: #fff; cursor: pointer; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    button:hover:not(:disabled) { background: #f0f0f0; }
  `]
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
