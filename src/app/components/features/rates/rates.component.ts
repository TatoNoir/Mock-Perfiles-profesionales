import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RatesService, Rate, RateFilters } from './services/rates.service';

@Component({
  selector: 'app-rates',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {
  rates: Rate[] = [];
  filteredRates: Rate[] = [];
  filters: RateFilters = {};
  loading = false;
  error: string | null = null;

  constructor(private ratesService: RatesService) { }

  ngOnInit(): void {
    this.loadRates();
  }

  loadRates(): void {
    this.loading = true;
    this.error = null;

    this.ratesService.getRates().subscribe({
      next: (rates) => {
        this.rates = rates;
        this.applyFilters();
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
      this.ratesService.getRatesWithFilters(this.filters).subscribe({
        next: (rates) => {
          this.filteredRates = rates;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al filtrar las valoraciones';
          this.loading = false;
          console.error('Error filtering rates:', error);
        }
      });
    } else {
      this.filteredRates = [...this.rates];
    }
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.user_id || this.filters.message);
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {};
    this.filteredRates = [...this.rates];
  }

  addRate(): void {
    // TODO: Implementar modal para agregar valoración
    console.log('Agregar valoración');
  }

  editRate(rate: Rate): void {
    // TODO: Implementar modal para editar valoración
    console.log('Editar valoración:', rate);
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
}
