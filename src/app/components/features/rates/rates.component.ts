import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RatesService, Rate, RateFilters, RatesResponse } from './services/rates.service';
import { EditRateModalComponent } from './modals/edit-rate-modal/edit-rate-modal.component';
import { AddRateModalComponent } from './modals/add-rate-modal/add-rate-modal.component';

@Component({
  selector: 'app-rates',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, EditRateModalComponent, AddRateModalComponent],
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {
  rates: Rate[] = [];
  filters: RateFilters = {};
  loading = false;
  error: string | null = null;
  
  // Modal state
  showEditModal = false;
  showAddModal = false;
  selectedRate: Rate | null = null;

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  constructor(private ratesService: RatesService) { }

  ngOnInit(): void {
    this.loadRates();
  }

  loadRates(): void {
    this.loading = true;
    this.error = null;

    this.ratesService.getRates(this.currentPage, this.itemsPerPage).subscribe({
      next: (response: RatesResponse) => {
        this.rates = response.data;
        this.totalItems = response.pagination.total;
        this.totalPages = response.pagination.last_page;
        this.currentPage = response.pagination.current_page;
        this.itemsPerPage = response.pagination.per_page;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las valoraciones';
        this.loading = false;
        console.error('Error loading rates:', error);
      }
    });
  }

  applyFilters(): void {
    if (this.hasActiveFilters()) {
      this.loading = true;
      this.ratesService.getRatesWithFilters(this.filters, this.currentPage, this.itemsPerPage).subscribe({
        next: (response: RatesResponse) => {
          this.rates = response.data;
          this.totalItems = response.pagination.total;
          this.totalPages = response.pagination.last_page;
          this.currentPage = response.pagination.current_page;
          this.itemsPerPage = response.pagination.per_page;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al filtrar las valoraciones';
          this.loading = false;
          console.error('Error filtering rates:', error);
        }
      });
    } else {
      this.loadRates();
    }
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.user_id || this.filters.message);
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  clearFilters(): void {
    this.currentPage = 1;
    this.filters = {};
    this.loadRates();
  }

  addRate(): void {
    this.showAddModal = true;
  }

  onCloseAddModal(): void {
    this.showAddModal = false;
  }

  onRateCreated(newRate: Rate): void {
    // Recargar la lista para mantener la paginación correcta
    this.loadRates();
    this.showAddModal = false;
  }

  editRate(rate: Rate): void {
    this.selectedRate = rate;
    this.showEditModal = true;
  }

  onCloseEditModal(): void {
    this.showEditModal = false;
    this.selectedRate = null;
  }

  onRateUpdated(updatedRate: Rate): void {
    // Recargar la lista para mantener la paginación correcta
    if (this.hasActiveFilters()) {
      this.applyFilters();
    } else {
      this.loadRates();
    }
    this.showEditModal = false;
    this.selectedRate = null;
  }

  deleteRate(rate: Rate): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta valoración?')) {
      this.loading = true;
      this.ratesService.deleteRate(rate.id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadRates();
          } else {
            this.error = 'Error al eliminar la valoración';
            this.loading = false;
          }
        },
        error: (error) => {
          this.error = 'Error al eliminar la valoración';
          this.loading = false;
          console.error('Error deleting rate:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStars(value: number): string {
    return '★'.repeat(value) + '☆'.repeat(5 - value);
  }

  trackByRateId(index: number, rate: Rate): number {
    return rate.id || index;
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    if (this.hasActiveFilters()) {
      this.applyFilters();
    } else {
      this.loadRates();
    }
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    if (this.hasActiveFilters()) {
      this.applyFilters();
    } else {
      this.loadRates();
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
