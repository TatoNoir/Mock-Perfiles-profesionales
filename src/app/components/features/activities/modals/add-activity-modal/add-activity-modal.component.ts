import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivitiesService, CreateActivityRequest } from '../../services/activities.service';

@Component({
  selector: 'app-add-activity-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-activity-modal.component.html',
  styleUrls: ['./add-activity-modal.component.css']
})
export class AddActivityModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() activityCreated = new EventEmitter<void>();

  addForm!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private activitiesService: ActivitiesService
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      short_code: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.minLength(2)]],
      tags: [''],
      disabled: [0, Validators.required]
    });
  }

  onSubmit() {
    if (this.addForm.valid) {
      this.loading = true;
      this.error = null;

      const formValue = this.addForm.value;
      const request: CreateActivityRequest = {
        name: formValue.name,
        short_code: formValue.short_code,
        tags: formValue.tags,
        code: formValue.code,
        disabled: formValue.disabled
      };

      this.activitiesService.createActivity(request)
        .subscribe({
          next: () => {
            this.loading = false;
            this.activityCreated.emit();
            this.onClose();
          },
          error: (error) => {
            this.loading = false;
            this.error = error.error?.error || error.error || 'Error al crear la actividad';
          }
        });
    }
  }

  onClose() {
    this.close.emit();
  }
}
