import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, MatIconModule,FormsModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() totalRecords = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50]; 
  @Input() pageSize = 10;
  @Input() currentPage = 1; // Nhận currentPage từ bên ngoài
  @Output() pageChanged = new EventEmitter<number>();
  @Output() sizeChanged = new EventEmitter<number>();

  totalPages = 0;
  pageNumbers: (number | string)[] = [];

  ngOnInit(): void {
    this.calculatePages();
  }

  ngOnChanges(): void {
    this.calculatePages();
  }

  calculatePages(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

    // Đảm bảo currentPage nằm trong khoảng hợp lệ
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    this.setPageNumbers();
  }

  setPageNumbers(): void {
    const visiblePages = 5;
    this.pageNumbers = [];

    if (this.totalPages <= visiblePages) {
      this.pageNumbers = Array(this.totalPages).fill(0).map((x, i) => i + 1);
    } else {
      if (this.currentPage <= 3) {
        this.pageNumbers = [1, 2, 3, 4, '...', this.totalPages];
      } else if (this.currentPage >= this.totalPages - 2) {
        this.pageNumbers = [1, '...', this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages];
      } else {
        this.pageNumbers = [1, '...', this.currentPage - 1, this.currentPage, this.currentPage + 1, '...', this.totalPages];
      }
    }
  }

  onPageChange(page: number | string): void {
    if (typeof page === 'number') {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.pageChanged.emit(this.currentPage);
        this.setPageNumbers();
      }
    } else if (page === '...') {
      // Xử lý khi nhấp vào '...'
    }
  }

  goToFirstPage(): void {
    this.onPageChange(1);
  }

  goToLastPage(): void {
    this.onPageChange(this.totalPages);
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.onPageChange(this.currentPage + 1);
    }
  }
  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.sizeChanged.emit(this.pageSize);
  }
}
