import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsersService, CreateUserRequest, ApiUser, ApiActivity, ApiDocumentType, ApiUserType, GeoCountry, GeoState, GeoLocality } from '../../services/users.service';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css']
})
export class AddUserModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() userCreated = new EventEmitter<ApiUser>();

  addForm: FormGroup;
  loading = false;
  error: string | null = null;
  activities: ApiActivity[] = [];
  filteredActivities: ApiActivity[] = [];
  selectedActivities: number[] = [];
  searchTerm: string = '';
  showDropdown: boolean = false;
  documentTypes: ApiDocumentType[] = [];
  userTypes: ApiUserType[] = [];

  // Geo typeahead state
  private destroy$ = new Subject<void>();
  private countryInput$ = new Subject<string>();
  private stateInput$ = new Subject<string>();
  private localityInput$ = new Subject<string>();

  countryText = '';
  provinceText = '';
  localityText = '';

  countrySuggestions: GeoCountry[] = [];
  stateSuggestions: GeoState[] = [];
  localitySuggestions: GeoLocality[] = [];
  showCountryDropdown = false;
  showStateDropdown = false;
  showLocalityDropdown = false;
  selectedCountryId: number | null = null;
  selectedStateId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService
  ) {
    this.addForm = this.fb.group({
      username: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      document_type: ['DNI', [Validators.required]],
      document_number: ['', [Validators.required]],
      birth_date: ['', [Validators.required]],
      nationality: ['Argentina', [Validators.required]],
      country_phone: ['+54', [Validators.required]],
      area_code: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      email_verified_at: [null],
      profile_picture: [null],
      description: [''],
      address: [''],
      street: [''],
      street_number: [''],
      floor: [''],
      apartment: [''],
      user_type_id: ['', [Validators.required]],
      locality_id: [null, [Validators.required]],
      activities: [[]]
    });
  }

  ngOnInit(): void {
    this.loadActivities();
    this.loadDocumentTypes();
    this.loadUserTypes();
    this.setupTypeaheads();
  }

  loadActivities(): void {
    this.usersService.getActivities().subscribe({
      next: (activities: ApiActivity[]) => {
        this.activities = activities;
        this.filteredActivities = activities;
      },
      error: (err: any) => {
        console.error('Error cargando actividades en modal:', err);
      }
    });
  }

  loadDocumentTypes(): void {
    this.usersService.getDocumentTypes().subscribe({
      next: (documentTypes: ApiDocumentType[]) => {
        this.documentTypes = documentTypes;
      },
      error: (err: any) => {
        console.error('Error cargando tipos de documento en modal:', err);
      }
    });
  }

  loadUserTypes(): void {
    this.usersService.getUserTypes().subscribe({
      next: (userTypes: ApiUserType[]) => {
        this.userTypes = userTypes;
      },
      error: (err: any) => {
        console.error('Error cargando tipos de usuario en modal:', err);
      }
    });
  }

  onClose(): void {
    if (!this.loading) {
      this.addForm.reset();
      this.addForm.patchValue({
        document_type: 'DNI',
        nationality: 'Argentina',
        country_phone: '+54',
        email_verified_at: null,
        profile_picture: null,
        user_type_id: '',
        locality_id: null,
        activities: []
      });
      this.countryText = '';
      this.provinceText = '';
      this.localityText = '';
      this.countrySuggestions = [];
      this.stateSuggestions = [];
      this.localitySuggestions = [];
      this.showCountryDropdown = false;
      this.showStateDropdown = false;
      this.showLocalityDropdown = false;
      this.selectedCountryId = null;
      this.selectedStateId = null;
      this.selectedActivities = [];
      this.searchTerm = '';
      this.filteredActivities = this.activities;
      this.showDropdown = false;
      this.error = null;
      this.close.emit();
    }
  }

  onSubmit(): void {
    if (this.addForm.valid && !this.loading) {
      this.loading = true;
      this.error = null;

      const formValue = this.addForm.value;
      const request: CreateUserRequest = {
        username: formValue.username,
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        document_type: formValue.document_type,
        document_number: formValue.document_number,
        birth_date: formValue.birth_date,
        nationality: formValue.nationality,
        country_phone: formValue.country_phone,
        area_code: formValue.area_code,
        phone_number: formValue.phone_number,
        password: formValue.password,
        email: formValue.email,
        email_verified_at: formValue.email_verified_at,
        profile_picture: formValue.profile_picture,
        description: formValue.description || '',
        address: formValue.address || '',
        street: formValue.street || '',
        street_number: formValue.street_number || '',
        floor: formValue.floor || '',
        apartment: formValue.apartment || '',
        user_type_id: formValue.user_type_id,
        locality_id: formValue.locality_id,
        activities: this.selectedActivities
      };

      this.usersService.createUser(request).subscribe({
        next: (newUser) => {
          this.loading = false;
          this.userCreated.emit(newUser);
          this.onClose();
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al crear usuario:', error);
          this.error = 'Error al crear el usuario. Por favor, intente nuevamente.';
        }
      });
    }
  }

  // --- Geo Typeahead setup & handlers ---
  private setupTypeaheads(): void {
    this.countryInput$
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe(query => {
        this.usersService.getCountries(query).subscribe((countries) => {
          this.countrySuggestions = countries;
          this.showCountryDropdown = this.countrySuggestions.length > 0;
        });
      });

    this.stateInput$
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe(query => {
        if (!this.selectedCountryId) { this.stateSuggestions = []; this.showStateDropdown = false; return; }
        this.usersService.getProvincesByCountry(this.selectedCountryId).subscribe(states => {
          const list = states || [];
          const q = (query || '').toLowerCase().trim();
          this.stateSuggestions = q ? list.filter(s => s.name.toLowerCase().includes(q)).slice(0, 20) : list.slice(0, 10);
          this.showStateDropdown = this.stateSuggestions.length > 0;
        });
      });

    this.localityInput$
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe(query => {
        if (!this.selectedStateId) { this.localitySuggestions = []; this.showLocalityDropdown = false; return; }
        this.usersService.getLocalitiesByState(this.selectedStateId).subscribe(localities => {
          const list = localities || [];
          const q = (query || '').toLowerCase().trim();
          this.localitySuggestions = q ? list.filter(l => l.name.toLowerCase().includes(q)).slice(0, 20) : list.slice(0, 10);
          this.showLocalityDropdown = this.localitySuggestions.length > 0;
        });
      });
  }

  onCountryInput(value: string): void {
    this.countryText = value;
    this.countryInput$.next(value);
  }

  onCountryFocus(): void {
    if (this.countrySuggestions.length === 0) {
      this.usersService.getCountries('').subscribe(countries => {
        this.countrySuggestions = countries || [];
        this.showCountryDropdown = this.countrySuggestions.length > 0;
      });
    } else {
      this.showCountryDropdown = this.countrySuggestions.length > 0;
    }
  }

  onSelectCountry(country: GeoCountry): void {
    this.countryText = country.name;
    this.selectedCountryId = country.id;
    this.showCountryDropdown = false;
    // Reset downstream selections
    this.provinceText = '';
    this.localityText = '';
    this.selectedStateId = null;
    this.addForm.patchValue({ locality_id: null });
  }

  onStateInput(value: string): void {
    this.provinceText = value;
    this.stateInput$.next(value);
  }

  onStateFocus(): void {
    if (!this.selectedCountryId) { return; }
    this.usersService.getProvincesByCountry(this.selectedCountryId).subscribe(states => {
      this.stateSuggestions = states || [];
      this.showStateDropdown = this.stateSuggestions.length > 0;
    });
  }

  onSelectState(state: GeoState): void {
    this.provinceText = state.name;
    this.selectedStateId = state.id;
    this.showStateDropdown = false;
    // Reset locality
    this.localityText = '';
    this.addForm.patchValue({ locality_id: null });
  }

  onLocalityInput(value: string): void {
    this.localityText = value;
    this.localityInput$.next(value);
  }

  onLocalityFocus(): void {
    if (!this.selectedStateId) { return; }
    this.usersService.getLocalitiesByState(this.selectedStateId).subscribe(localities => {
      this.localitySuggestions = localities || [];
      this.showLocalityDropdown = this.localitySuggestions.length > 0;
    });
  }

  onSelectLocality(locality: GeoLocality): void {
    this.localityText = locality.name;
    this.showLocalityDropdown = false;
    this.addForm.patchValue({ locality_id: locality.id });
  }

  preventNativeAutofill(ev: FocusEvent): void {
    const el = ev.target as HTMLInputElement;
    if (!el) return;
    const prev = el.readOnly;
    el.readOnly = true;
    setTimeout(() => (el.readOnly = prev), 120);
  }

  filterActivities(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.filteredActivities = this.activities.filter(activity => 
      activity.name.toLowerCase().includes(this.searchTerm)
    );
    this.showDropdown = this.searchTerm.length > 0;
  }

  toggleActivity(activityId: number): void {
    if (this.selectedActivities.includes(activityId)) {
      // Remover actividad si está seleccionada
      this.selectedActivities = this.selectedActivities.filter(id => id !== activityId);
    } else {
      // Agregar actividad si no está ya seleccionada
      this.selectedActivities.push(activityId);
    }
    
    // Actualizar el formulario
    this.addForm.patchValue({
      activities: this.selectedActivities
    });
    
  }

  isActivitySelected(activityId: number): boolean {
    return this.selectedActivities.includes(activityId);
  }

  getActivityName(activityId: number): string {
    const activity = this.activities.find(a => a.id === activityId);
    return activity ? activity.name : '';
  }

  removeActivity(activityId: number): void {
    this.selectedActivities = this.selectedActivities.filter(id => id !== activityId);
    this.addForm.patchValue({
      activities: this.selectedActivities
    });
  }

  onSearchFocus(): void {
    this.showDropdown = this.searchTerm.length > 0;
  }

  onSearchBlur(): void {
    // Delay para permitir que el click en las opciones se ejecute
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
}
