import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ZonesService, ZoneFilters, ApiCountry, ApiState, ApiLocality, ZipCodesResponse } from './services/zones.service';

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
  private provinceInput$ = new Subject<string>();
  private localityInput$ = new Subject<string>();
  
  // Data
  // Resultados de códigos postales
  zipResults: { id: number; code: string; locality_id: number; locality?: { id: number; name: string } }[] = [];
  
  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  countries: string[] = [];
  countrySuggestions: ApiCountry[] = [];
  showCountryDropdown = false;
  selectedCountryId: number | null = null;

  // Provincias (typeahead)
  statesAll: ApiState[] = [];
  provinceSuggestions: ApiState[] = [];
  showProvinceDropdown = false;
  provinces: string[] = [];
  cities: string[] = [];
  selectedStateId: number | null = null;
  selectedLocality: ApiLocality | null = null;
  // Localidades (typeahead)
  localitiesAll: ApiLocality[] = [];
  localitySuggestions: ApiLocality[] = [];
  showLocalityDropdown = false;
  
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
    this.setupProvinceTypeahead();
    this.setupLocalityTypeahead();
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
   * Configura el typeahead de provincias (filtrado local sobre lista cargada por país)
   */
  private setupProvinceTypeahead(): void {
    this.provinceInput$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((query) => {
        const q = (query || '').toLowerCase().trim();
        if (!q) {
          this.provinceSuggestions = this.statesAll.slice(0, 10);
          this.showProvinceDropdown = this.provinceSuggestions.length > 0;
          return;
        }
        this.provinceSuggestions = this.statesAll
          .filter(s => s.name.toLowerCase().includes(q))
          .slice(0, 20);
        this.showProvinceDropdown = this.provinceSuggestions.length > 0;
      });
  }

  /**
   * Configura el typeahead de localidades (filtrado local sobre lista por provincia)
   */
  private setupLocalityTypeahead(): void {
    this.localityInput$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((query) => {
        const q = (query || '').toLowerCase().trim();
        if (!q) {
          this.localitySuggestions = this.localitiesAll.slice(0, 10);
          this.showLocalityDropdown = this.localitySuggestions.length > 0;
          return;
        }
        this.localitySuggestions = this.localitiesAll
          .filter(l => l.name.toLowerCase().includes(q))
          .slice(0, 20);
        this.showLocalityDropdown = this.localitySuggestions.length > 0;
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
    this.statesAll = [];
    this.provinceSuggestions = [];
    this.showProvinceDropdown = false;
    if (this.selectedCountryId != null) {
      this.zonesService.getProvincesByCountry(this.selectedCountryId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (states) => {
            this.statesAll = states || [];
          },
          error: (error) => {
            console.error('Error al cargar provincias:', error);
            this.statesAll = [];
          }
        });
    }
  }

  /**
   * Maneja el cambio de provincia
   */
  onProvinceChange(): void {
    this.filters.city = '';
    this.cities = [];
    this.localitiesAll = [];
    this.localitySuggestions = [];
    this.showLocalityDropdown = false;
    // Sin llamadas por ahora
  }

  /**
   * Aplica los filtros localmente a las zonas
   */
  onSearch(): void {
    this.currentPage = 1; // Reset a la primera página
    this.loadZipCodes();
  }

  /**
   * Carga los códigos postales con paginación
   */
  private loadZipCodes(): void {
    // Modo 1: búsqueda por código postal directo
    const cp = (this.filters.postal_code || '').trim();
    if (cp) {
      this.loading = true;
      this.zonesService.getZipCodesByCode(cp, this.currentPage, this.itemsPerPage)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: ZipCodesResponse) => { 
            this.zipResults = response.data || []; 
            this.totalItems = response.pagination.total;
            this.totalPages = response.pagination.last_page;
          },
          error: () => { 
            this.zipResults = []; 
            this.totalItems = 0;
            this.totalPages = 0;
          },
          complete: () => { this.loading = false; }
        });
      return;
    }
    // Modo 2a: país + provincia + localidad
    if (this.selectedLocality?.id != null) {
      this.loading = true;
      this.zonesService.getZipCodesByLocality(this.selectedLocality.id, this.currentPage, this.itemsPerPage)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: ZipCodesResponse) => { 
            this.zipResults = response.data || []; 
            this.totalItems = response.pagination.total;
            this.totalPages = response.pagination.last_page;
          },
          error: () => { 
            this.zipResults = []; 
            this.totalItems = 0;
            this.totalPages = 0;
          },
          complete: () => { this.loading = false; }
        });
      return;
    }
    // Modo 2b: país + provincia (sin localidad) => buscar por provincia
    if (this.selectedStateId != null) {
      this.loading = true;
      this.zonesService.getZipCodesByState(this.selectedStateId, this.currentPage, this.itemsPerPage)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: ZipCodesResponse) => { 
            this.zipResults = response.data || []; 
            this.totalItems = response.pagination.total;
            this.totalPages = response.pagination.last_page;
          },
          error: () => { 
            this.zipResults = []; 
            this.totalItems = 0;
            this.totalPages = 0;
          },
          complete: () => { this.loading = false; }
        });
      return;
    }
    // Sin filtros válidos
    this.zipResults = [];
    this.totalItems = 0;
    this.totalPages = 0;
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
    this.cities = [];
    this.zipResults = [];
    this.currentPage = 1;
    this.totalItems = 0;
    this.totalPages = 0;
  }

  /**
   * Maneja el cambio de página
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadZipCodes();
  }

  /**
   * Maneja el cambio de elementos por página
   */
  onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1; // Reset a la primera página
    this.loadZipCodes();
  }

  /**
   * Maneja el cambio del select de elementos por página
   */
  onItemsPerPageSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = parseInt(target.value, 10);
    this.onItemsPerPageChange(value);
  }

  /**
   * Genera los números de página visibles
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  /**
   * Método helper para Math.min en el template
   */
  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  

  

  // Typeahead handlers
  onCountryInput(value: string): void {
    this.filters.country = value;
    const trimmed = (value || '').trim();
    // Si se deselecciona/borra el país, reseteamos provincias y localidades
    if (!trimmed) {
      this.selectedCountryId = null;
      this.filters.province = '';
      this.filters.city = '';
      this.provinces = [];
      this.cities = [];
      this.statesAll = [];
      this.provinceSuggestions = [];
      this.showProvinceDropdown = false;
    }
    this.countryInput$.next(value);
  }

  onSelectCountry(country: ApiCountry): void {
    this.filters.country = country.name;
    this.selectedCountryId = country.id;
    this.showCountryDropdown = false;
    this.countrySuggestions = [];
    this.onCountryChange();
  }

  // Province typeahead handlers
  onProvinceInput(value: string): void {
    this.filters.province = value;
    if (!this.selectedCountryId) {
      this.provinceSuggestions = [];
      this.showProvinceDropdown = false;
      return;
    }
    // Si aún no se cargó la lista, cargamos y luego filtramos
    if (this.statesAll.length === 0) {
      this.zonesService.getProvincesByCountry(this.selectedCountryId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (states) => {
            this.statesAll = states || [];
            this.provinceInput$.next(value);
          },
          error: () => {
            this.statesAll = [];
          }
        });
      return;
    }
    this.provinceInput$.next(value);
  }

  onSelectProvince(state: ApiState): void {
    this.filters.province = state.name;
    this.selectedStateId = state.id ?? null as any;
    this.showProvinceDropdown = false;
    this.provinceSuggestions = [];
    this.onProvinceChange();
    // Cargar localidades reales por state_id
    if (this.selectedStateId != null) {
      this.zonesService.getLocalitiesByState(this.selectedStateId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (localities) => {
            this.localitiesAll = localities || [];
            this.cities = (localities || []).map(l => l.name);
          },
          error: () => {
            this.localitiesAll = [];
            this.cities = [];
          }
        });
    }
  }

  onCityChange(localityName: string): void {
    this.filters.city = localityName;
    // Buscar el objeto localidad en base al nombre (mejoraría con id en opciones)
    const findInService = (name: string, stateId: number | null): void => {
      if (stateId == null) { return; }
      this.zonesService.getLocalitiesByState(stateId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (localities) => {
            this.selectedLocality = (localities || []).find(l => l.name === name) || null;
            const localityId = this.selectedLocality?.id;
            if (localityId != null) {
              this.zonesService.getZipCodesByLocality(localityId, 1, 1)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: (response: ZipCodesResponse) => {
                    const firstZipCode = response.data && response.data.length ? response.data[0] : null;
                    if (firstZipCode?.code) {
                      this.filters.postal_code = firstZipCode.code;
                    }
                  },
                  error: () => {}
                });
            }
          },
          error: () => { this.selectedLocality = null; }
        });
    };
    findInService(localityName, this.selectedStateId);
  }

  // Locality typeahead handlers
  onLocalityInput(value: string): void {
    this.filters.city = value;
    if (!this.selectedStateId) {
      this.localitySuggestions = [];
      this.showLocalityDropdown = false;
      return;
    }
    if (this.localitiesAll.length === 0) {
      this.zonesService.getLocalitiesByState(this.selectedStateId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (localities) => {
            this.localitiesAll = localities || [];
            this.localityInput$.next(value);
          },
          error: () => {
            this.localitiesAll = [];
          }
        });
      return;
    }
    this.localityInput$.next(value);
  }

  onSelectLocality(locality: ApiLocality): void {
    this.selectedLocality = locality;
    this.filters.city = locality.name;
    this.showLocalityDropdown = false;
    this.localitySuggestions = [];
    // Cargar CP por localidad seleccionada
    this.zonesService.getZipCodesByLocality(locality.id, 1, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ZipCodesResponse) => {
          const firstZipCode = response.data && response.data.length ? response.data[0] : null;
          if (firstZipCode?.code) {
            this.filters.postal_code = firstZipCode.code;
          }
        },
        error: () => {}
      });
  }

  // (TrackBy de zonas eliminado; la tabla usa zipResults)

  /**
   * Verifica si hay filtros activos
   */
  get hasActiveFilters(): boolean {
    return !!(this.filters.country || this.filters.province || this.filters.city || this.filters.postal_code);
  }

  /**
   * Evita que el navegador dispare autofill al enfocar el input.
   * Activa readOnly brevemente y luego lo desactiva.
   */
  preventNativeAutofill(ev: FocusEvent): void {
    const element = ev.target as HTMLInputElement | HTMLTextAreaElement;
    if (!element) {
      return;
    }
    const previousReadonly = element.readOnly;
    element.readOnly = true;
    setTimeout(() => {
      element.readOnly = previousReadonly;
    }, 120);
  }

}


