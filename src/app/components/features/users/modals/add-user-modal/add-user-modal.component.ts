import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsersService, CreateUserRequest, ApiUser, ApiActivity } from '../../services/users.service';

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

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService
  ) {
    this.addForm = this.fb.group({
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

  onClose(): void {
    if (!this.loading) {
      this.addForm.reset();
      this.addForm.patchValue({
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
    if (this.addForm.valid && !this.loading) {
      this.loading = true;
      this.error = null;

      const formValue = this.addForm.value;
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
