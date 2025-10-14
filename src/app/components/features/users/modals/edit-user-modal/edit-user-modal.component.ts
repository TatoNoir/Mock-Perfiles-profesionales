import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsersService, CreateUserRequest, ApiUser, ApiActivity } from '../../services/users.service';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css']
})
export class EditUserModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() user: ApiUser | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<ApiUser>();

  editForm: FormGroup;
  loading = false;
  error: string | null = null;
  activities: ApiActivity[] = [];
  filteredActivities: ApiActivity[] = [];
  selectedActivities: number[] = [];
  searchTerm: string = '';
  showDropdown: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService
  ) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', [Validators.required]],
      description: [''],
      user_type_id: [1], // Hardcodeado
      locality_id: [1], // Hardcodeado
      activities: [[]] // Se manejará con checkboxes
    });
  }

  ngOnInit(): void {
    this.loadActivities();
    if (this.user) {
      this.populateForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.populateForm();
    }
  }

  private populateForm(): void {
    if (this.user) {
      // Extraer IDs de actividades del usuario
      const userActivityIds = this.user.activities.map(activity => activity.id);
      this.selectedActivities = userActivityIds;
      
      this.editForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        password: '', // No pre-llenamos la contraseña por seguridad
        phone: this.user.phone,
        description: this.user.description || '',
        user_type_id: 1, // Hardcodeado
        locality_id: 1, // Hardcodeado
        activities: userActivityIds
      });
    }
  }

  onClose(): void {
    if (!this.loading) {
      this.editForm.reset();
      this.editForm.patchValue({
        user_type_id: 1,
        locality_id: 1,
        activities: []
      });
      this.selectedActivities = [];
      this.searchTerm = '';
      this.filteredActivities = this.activities;
      this.showDropdown = false;
      this.error = null;
      this.close.emit();
    }
  }

  onSubmit(): void {
    if (this.editForm.valid && !this.loading && this.user) {
      this.loading = true;
      this.error = null;

      const formValue = this.editForm.value;
      const request: CreateUserRequest = {
        name: formValue.name,
        email: formValue.email,
        password: formValue.password,
        phone: formValue.phone,
        description: formValue.description || '',
        user_type_id: formValue.user_type_id,
        locality_id: formValue.locality_id,
        activities: this.selectedActivities
      };

      this.usersService.updateUser(this.user.id, request).subscribe({
        next: (updatedUser) => {
          this.loading = false;
          this.userUpdated.emit(updatedUser);
          this.onClose();
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al actualizar usuario:', error);
          this.error = 'Error al actualizar el usuario. Por favor, intente nuevamente.';
        }
      });
    }
  }

  loadActivities(): void {
    this.usersService.getActivities().subscribe({
      next: (activities: ApiActivity[]) => {
        this.activities = activities;
        this.filteredActivities = activities;
      },
      error: (err: any) => {
        console.error('Error cargando actividades en modal de edición:', err);
      }
    });
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
    this.editForm.patchValue({
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
    this.editForm.patchValue({
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
