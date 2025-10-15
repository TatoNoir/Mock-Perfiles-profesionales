import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ZonesService, ApiZone, ZoneFilters, ApiCountry } from './services/zones.service';

@Component({
  selector: 'app-zones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.css']
})
export class ZonesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private countryInput$ = new Subject<string>();
  
  // Data
  zones: ApiZone[] = [];
  filteredZones: ApiZone[] = [];
  countries: string[] = [];
  countrySuggestions: ApiCountry[] = [];
  showCountryDropdown = false;
  provinces: string[] = [];
  cities: string[] = [];
  
  // State
  loading = false;
  error: string | null = null;
  
  // Filters
  filters: ZoneFilters = {
    country: '',
    province: '',
    city: '',
    postal_code: ''
  };

  constructor(private zonesService: ZonesService) {}

  ngOnInit(): void {
    this.setupCountryTypeahead();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Configura el typeahead de países (debounced queries)
   */
  private setupCountryTypeahead(): void {
    this.countryInput$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => this.zonesService.getCountries(query))
      )
      .subscribe({
        next: (countries) => {
          this.countrySuggestions = countries;
          this.showCountryDropdown = countries.length > 0;
        },
        error: (error) => {
          console.error('Error buscando países:', error);
          this.countrySuggestions = [];
          this.showCountryDropdown = false;
        }
      });
  }

  /**
   * Maneja el cambio de país
   */
  onCountryChange(): void {
    this.filters.province = '';
    this.filters.city = '';
    this.provinces = [];
    this.cities = [];
    // Por ahora no cargamos provincias/ciudades desde API
  }

  /**
   * Maneja el cambio de provincia
   */
  onProvinceChange(): void {
    this.filters.city = '';
    this.cities = [];
    // Sin llamadas por ahora
  }

  /**
   * Aplica los filtros localmente a las zonas
   */
  onSearch(): void {
    // Sin llamadas a zonas por ahora
    console.log('Buscar (sin llamados a zonas por ahora):', this.filters);
  }

  /**
   * Limpia los filtros y recarga todas las zonas
   */
  onClearFilters(): void {
    this.filters = {
      country: '',
      province: '',
      city: '',
      postal_code: ''
    };
    this.provinces = [];
    this.cities = [];
    this.filteredZones = [...this.zones];
  }

  

  

  // Typeahead handlers
  onCountryInput(value: string): void {
    this.filters.country = value;
    this.countryInput$.next(value);
  }

  onSelectCountry(country: ApiCountry): void {
    this.filters.country = country.name;
    this.showCountryDropdown = false;
    this.countrySuggestions = [];
    this.onCountryChange();
  }

  /**
   * TrackBy function para optimizar el rendimiento de *ngFor
   */
  trackByZoneId(index: number, zone: ApiZone): number {
    return zone.id;
  }

  /**
   * Verifica si hay filtros activos
   */
  get hasActiveFilters(): boolean {
    return !!(this.filters.country || this.filters.province || this.filters.city || this.filters.postal_code);
  }
}


