import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsersService, CreateUserRequest, ApiUser } from '../../services/users.service';

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css']
})
export class AddUserModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() userCreated = new EventEmitter<ApiUser>();

  addForm: FormGroup;
  loading = false;
  error: string | null = null;

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
      activities: [[3]] // Hardcodeado
    });
  }

  onClose(): void {
    if (!this.loading) {
      this.addForm.reset();
      this.addForm.patchValue({
        user_type_id: 1,
        locality_id: 1,
        activities: [3]
      });
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
        activities: formValue.activities
      };

      this.usersService.createUser(request).subscribe({
        next: (newUser) => {
          this.loading = false;
          console.log('Usuario creado:', newUser);
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
}
