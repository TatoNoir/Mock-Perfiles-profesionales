import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsersService, CreateUserRequest, ApiUser } from '../../services/users.service';

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
      activities: [[3, 2]] // Hardcodeado
    });
  }

  ngOnInit(): void {
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
      this.editForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        password: '', // No pre-llenamos la contraseña por seguridad
        phone: this.user.phone,
        description: this.user.description || '',
        user_type_id: 1, // Hardcodeado
        locality_id: 1, // Hardcodeado
        activities: [3, 2] // Hardcodeado
      });
    }
  }

  onClose(): void {
    if (!this.loading) {
      this.editForm.reset();
      this.editForm.patchValue({
        user_type_id: 1,
        locality_id: 1,
        activities: [3, 2]
      });
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
        activities: formValue.activities
      };

      this.usersService.updateUser(this.user.id, request).subscribe({
        next: (updatedUser) => {
          this.loading = false;
          console.log('Usuario actualizado:', updatedUser);
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
}
