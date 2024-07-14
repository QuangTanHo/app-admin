// pagination.component.ts
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() totalRecords = 0;
  @Input() pageSize = 10;
  @Output() pageChanged = new EventEmitter<number>();

  currentPage = 1;
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
      // this.showNextPages();
    }
  }

  showNextPages(): void {
    if (this.pageNumbers.includes('...')) {
      const index = this.pageNumbers.indexOf('...');
      let startPage = typeof this.pageNumbers[index - 1] === 'number' ? (this.pageNumbers[index - 1] as number) + 1 : 1;
      this.pageNumbers.splice(index, 1); // Remove '...'

      while (startPage <= this.totalPages && this.pageNumbers.length < 7) {
        this.pageNumbers.push(startPage++);
      }

      if (this.pageNumbers.length < 7 && this.pageNumbers[this.pageNumbers.length - 1] !== this.totalPages) {
        this.pageNumbers.push('...');
        this.pageNumbers.push(this.totalPages);
      }
    }
  }

  showPreviousPages(): void {
    if (this.pageNumbers.includes('...')) {
      const index = this.pageNumbers.indexOf('...');
      let endPage = typeof this.pageNumbers[index + 1] === 'number' ? (this.pageNumbers[index + 1] as number) - 1 : this.totalPages;
      this.pageNumbers.splice(index, 1); // Remove '...'

      while (endPage >= 1 && this.pageNumbers.length < 7) {
        this.pageNumbers.unshift(endPage--);
      }

      if (this.pageNumbers.length < 7 && this.pageNumbers[0] !== 1) {
        this.pageNumbers.unshift('...');
        this.pageNumbers.unshift(1);
      }
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
}
